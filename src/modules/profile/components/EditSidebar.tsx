import { useState, useEffect } from "react";
import { playersApi } from "@/shared/api/players.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { profileSchema } from "@/shared/validation/formSchemas";
import { useForm, FormProvider, Field } from "@/shared/form";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Button } from "@/shared/components/Button";
import { useSidebar, type SidebarContentProps } from "@/shared/components/Sidebar";
import { PROFILE_COLORS, type UserProfile } from "../models";
import { CountrySelect } from "./CountrySelect";

interface EditSidebarProps {
  user: UserProfile;
  playerId?: string;
  onSave: (u: UserProfile) => boolean | Promise<boolean>;
}

export function EditSidebar({ user, playerId, onSave, closeSidebar }: EditSidebarProps & SidebarContentProps) {
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const { setFooter } = useSidebar();

  const { ctx, values, set, submit } = useForm(profileSchema, {
    firstName:   user.firstName,
    lastName:    user.lastName,
    username:    user.username,
    email:       user.email,
    bio:         user.bio,
    countryCode: user.countryCode,
    color:       user.color,
    elo:         user.elo,
    joinedYear:  user.joinedYear,
  });

  useEffect(() => {
    if (!playerId) return;
    setLoadingPlayer(true);
    playersApi.getOne(playerId)
      .then((p) => { set("username", p.username); set("elo", p.elo); })
      .catch((err) => addToast({ type: "error", title: "Profil incomplet", message: getErrorMessage(err, "Impossible de charger les informations joueur.") }))
      .finally(() => setLoadingPlayer(false));
  }, [addToast, playerId]);

  const handleSaveClick = async () => {
    const parsed = submit();
    if (!parsed) return;
    setSaving(true);
    const saved = await onSave(parsed as UserProfile);
    setSaving(false);
    if (saved) closeSidebar();
  };

  useEffect(() => {
    setFooter(
      <>
        <Button variant="profile-outline" onClick={closeSidebar} className="flex-1 justify-center px-4 py-3" label="Annuler" />
        <Button
          variant="profile-primary"
          onClick={handleSaveClick}
          disabled={loadingPlayer || saving}
          className="flex-[2]"
          label={loadingPlayer ? "Chargement…" : saving ? "Enregistrement…" : "Enregistrer"}
        />
      </>,
    );
  }, [closeSidebar, loadingPlayer, saving, setFooter, handleSaveClick]);

  const firstName = (values.firstName as string) ?? "";
  const lastName  = (values.lastName  as string) ?? "";

  return (
    <FormProvider ctx={ctx}>
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
        <ProfileAvatar initials={(firstName[0] ?? "") + (lastName[0] ?? "")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field name="firstName" label="Prénom" />
        <Field name="lastName"  label="Nom" />
      </div>

      <Field name="username"    label="Nom d'utilisateur" />
      <Field name="email"       label="Email" type="email" />
      <Field name="bio"         label="Biographie" as="textarea" rows={3} />

      <Field name="countryCode" label="Pays">
        <CountrySelect value={values.countryCode as string} onChange={v => set("countryCode", v)} />
      </Field>

      <Field name="color" label="Couleur préférée">
        <div style={{ display: "flex", gap: 10 }}>
          {PROFILE_COLORS.map((c) => (
            <Button
              key={c}
              variant="profile-segment"
              onClick={() => set("color", c)}
              className={values.color === c ? "border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.08)] font-semibold text-[var(--color-gold)]" : ""}
              label={c}
            />
          ))}
        </div>
      </Field>
    </FormProvider>
  );
}
