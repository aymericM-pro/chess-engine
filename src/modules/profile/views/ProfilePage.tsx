import { useState, useEffect } from "react";
import { Trophy, Clock, TrendingUp, Pencil, CircleX } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { playersApi } from "@/shared/api/players.api";
import { usersApi } from "@/shared/api/users.api";
import { usePlayerStore } from "@/modules/players/store/playerStore";
import type { PatchPlayerBody, PatchUserBody } from "@/shared/api/types";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { Button } from "@/shared/components/Button";
import { useSidebar } from "@/shared/components/Sidebar";
import { EMPTY_USER, toProfileColor, type UserProfile } from "../models";
import { wins, losses, draws, total, winPct, avgMoves, topOpenings } from "../models/stats";
import { StatCard } from "../components/StatCard";
import { ProfileHero } from "../components/ProfileHero";
import { ResultsCard } from "../components/ResultsCard";
import { OpeningsCard } from "../components/OpeningsCard";
import { EditSidebar } from "../components/EditSidebar";

export function ProfilePage() {
  const authUser    = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const { player, fetchPlayer, setPlayer } = usePlayerStore();
  const addToast    = useToastStore((state) => state.addToast);
  const { openSidebar } = useSidebar();

  const [user, setUser] = useState<UserProfile>({
    ...EMPTY_USER,
    username: authUser?.username ?? "",
    email:    authUser?.email    ?? "",
  });

  useEffect(() => {
    if (!authUser) return;
    const load = player
      ? Promise.resolve(player)
      : fetchPlayer(authUser.id).then(() => usePlayerStore.getState().player!);

    load
      .then((p) => {
        if (!p) return;
        setUser({
          username:    p.username,
          firstName:   authUser.firstName ?? "",
          lastName:    authUser.lastName  ?? "",
          email:       authUser.email     ?? "",
          bio:         p.bio              ?? "",
          countryCode: p.country          ?? "FR",
          color:       toProfileColor(p.preferredColor),
          elo:         p.elo,
          joinedYear:  new Date(p.createdAt).getFullYear(),
        });
      })
      .catch((err) => addToast({ type: "error", title: "Profil non chargé", message: getErrorMessage(err, "Impossible de charger votre profil joueur.") }));
  }, [addToast, authUser, fetchPlayer, player]);

  const handleSave = async (draft: UserProfile): Promise<boolean> => {
    if (!authUser) {
      setUser(draft);
      addToast({ type: "success", title: "Profil mis à jour" });
      return true;
    }

    const userBody: PatchUserBody = {};
    if (draft.firstName !== user.firstName) userBody.firstName = draft.firstName;
    if (draft.lastName  !== user.lastName)  userBody.lastName  = draft.lastName;

    const playerBody: PatchPlayerBody = {};
    if (draft.username    !== user.username)    playerBody.username       = draft.username;
    if (draft.elo         !== user.elo)         playerBody.elo            = draft.elo;
    if (draft.bio         !== user.bio)         playerBody.bio            = draft.bio;
    if (draft.countryCode !== user.countryCode) playerBody.country        = draft.countryCode;
    if (draft.color       !== user.color)       playerBody.preferredColor = draft.color;

    if (!Object.keys(userBody).length && !Object.keys(playerBody).length) {
      setUser(draft);
      addToast({ type: "info", title: "Aucune modification", message: "Votre profil était déjà à jour." });
      return true;
    }

    try {
      const [updatedUser, updatedPlayer] = await Promise.all([
        Object.keys(userBody).length   > 0 ? usersApi.patch(authUser.id, userBody)     : Promise.resolve(authUser),
        Object.keys(playerBody).length > 0 ? playersApi.patch(authUser.id, playerBody) : Promise.resolve(player),
      ]);

      if (Object.keys(userBody).length)   setAuthUser(updatedUser!);
      if (Object.keys(playerBody).length) setPlayer(updatedPlayer!);

      setUser({
        username:    updatedPlayer?.username                              ?? draft.username,
        firstName:   updatedUser?.firstName                               ?? draft.firstName,
        lastName:    updatedUser?.lastName                                ?? draft.lastName,
        email:       draft.email,
        bio:         updatedPlayer?.bio                                   ?? draft.bio,
        countryCode: updatedPlayer?.country                               ?? draft.countryCode,
        color:       toProfileColor(updatedPlayer?.preferredColor ?? draft.color),
        elo:         updatedPlayer?.elo                                   ?? draft.elo,
        joinedYear:  updatedPlayer ? new Date(updatedPlayer.createdAt).getFullYear() : draft.joinedYear,
      });
      addToast({ type: "success", title: "Profil sauvegardé", message: "Vos modifications ont bien été enregistrées." });
      return true;
    } catch (err) {
      addToast({ type: "error", title: "Sauvegarde impossible", message: getErrorMessage(err, "Impossible de sauvegarder le profil.") });
      return false;
    }
  };

  const openEditSidebar = () => {
    openSidebar(
      EditSidebar,
      { user, playerId: authUser?.id, onSave: handleSave },
      { title: "Modifier le profil", description: "Les modifications sont sauvegardées sur votre compte.", closeIcon: <CircleX size={18} />, closeLabel: "Fermer la modification du profil", width: 480, zIndex: 300, bodyClassName: "flex flex-col gap-5 p-7", footerClassName: "flex gap-3 px-7 py-[18px]" },
    );
  };

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "48px 24px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>Profil</h1>
        <Button variant="profile-outline" onClick={openEditSidebar} icon={<Pencil size={14} />} label="Modifier le profil" />
      </div>

      <ProfileHero user={user} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon={Trophy}     label="Parties jouées"   value={total} />
        <StatCard icon={TrendingUp} label="Taux de victoire" value={`${winPct}%`} sub={`${wins}V · ${draws}N · ${losses}D`} />
        <StatCard icon={Clock}      label="Coups moyens"     value={avgMoves} sub="par partie" />
        <StatCard icon={Trophy}     label="ELO actuel"       value={user.elo} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ResultsCard wins={wins} draws={draws} losses={losses} total={total} />
        <OpeningsCard topOpenings={topOpenings} total={total} />
      </div>
    </div>
  );
}
