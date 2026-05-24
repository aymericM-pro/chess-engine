import { useEffect, useState } from "react";
import { Check, Clock3, Loader2, UserRound, UserRoundPlus, X } from "lucide-react";
import { friendsApi } from "@/shared/api/friends.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import type {
  FriendRequestPlayerDto,
  FriendRequestWithPlayerDto,
  FriendResponseDto,
} from "@/shared/api/types";
import { useToastStore } from "@/shared/toasts/toastStore";

type FriendsTab = "incoming" | "outgoing" | "friends";

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function formatSince(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function PlayerAvatar({ player }: { player: FriendRequestPlayerDto }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d7c07e,#ae824d)] text-sm font-black text-[#101217]">
      {initials(player.username)}
    </div>
  );
}

function PlayerSummary({ player, caption }: { player: FriendRequestPlayerDto; caption: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
        {player.username}
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
        {caption}
      </p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center bg-[rgba(255,255,255,0.012)] px-6 py-8 text-center">
      <div className="max-w-[300px]">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(201,169,110,0.08)] text-[var(--color-gold)]">
          <UserRoundPlus size={21} strokeWidth={1.8} />
        </div>
        <p className="text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  );
}

function RequestRow({
  request,
  direction,
  accepting,
  declining,
  onAccept,
  onDecline,
}: {
  request: FriendRequestWithPlayerDto;
  direction: "incoming" | "outgoing";
  accepting?: boolean;
  declining?: boolean;
  onAccept?: (request: FriendRequestWithPlayerDto) => void;
  onDecline?: (request: FriendRequestWithPlayerDto) => void;
}) {
  const player = direction === "incoming" ? request.requester : request.addressee;
  const caption = direction === "incoming"
    ? `${player.elo} ELO vous a envoyé une demande`
    : `Demande envoyée le ${formatSince(request.createdAt)}`;

  return (
    <div className="flex items-center gap-4 border-b border-[var(--color-border)] px-5 py-4 last:border-b-0">
      <PlayerAvatar player={player} />
      <PlayerSummary player={player} caption={caption} />

      {direction === "incoming" ? (
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={accepting || declining}
            onClick={() => onDecline?.(request)}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-[8px] border border-[var(--color-border)] bg-transparent px-3 text-xs font-black text-[var(--color-text-muted)] transition hover:border-[rgba(248,81,73,0.32)] hover:bg-[rgba(248,81,73,0.08)] hover:text-[var(--color-danger)] disabled:cursor-default disabled:opacity-60"
          >
            {declining ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
            Refuser
          </button>
          <button
            type="button"
            disabled={accepting || declining}
            onClick={() => onAccept?.(request)}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-[8px] border border-[rgba(201,169,110,0.34)] bg-[rgba(201,169,110,0.12)] px-4 text-xs font-black text-[var(--color-gold)] transition hover:bg-[rgba(201,169,110,0.18)] disabled:cursor-default disabled:opacity-60"
          >
            {accepting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Accepter
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-3)] px-3 py-2 text-xs font-bold text-[var(--color-text-muted)]">
          <Clock3 size={14} />
          En attente
        </div>
      )}
    </div>
  );
}

function FriendRow({ friend }: { friend: FriendResponseDto }) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--color-border)] px-5 py-4 last:border-b-0">
      <PlayerAvatar player={friend.player} />
      <PlayerSummary
        player={friend.player}
        caption={`${friend.player.elo} ELO · Ami depuis le ${formatSince(friend.since)}`}
      />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(63,185,80,0.10)] text-[var(--color-success)]">
        <UserRound size={17} strokeWidth={1.8} />
      </div>
    </div>
  );
}

export function FriendsPage() {
  const [friends, setFriends] = useState<FriendResponseDto[]>([]);
  const [incoming, setIncoming] = useState<FriendRequestWithPlayerDto[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequestWithPlayerDto[]>([]);
  const [activeTab, setActiveTab] = useState<FriendsTab>("incoming");
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    setLoading(true);
    Promise.all([friendsApi.list(), friendsApi.requests()])
      .then(([friendRows, requestRows]) => {
        setFriends(friendRows);
        setIncoming(requestRows.incoming);
        setOutgoing(requestRows.outgoing);
        setError(null);
      })
      .catch((err) => {
        const message = getErrorMessage(err, "Impossible de charger vos amis.");
        setError(message);
        addToast({ type: "error", title: "Amis non chargés", message });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const handleAccept = async (request: FriendRequestWithPlayerDto) => {
    setAcceptingId(request.id);
    try {
      const accepted = await friendsApi.accept(request.id);
      setIncoming((current) => current.filter((item) => item.id !== request.id));
      setFriends((current) => [
        {
          requestId: accepted.id,
          player: request.requester,
          since: accepted.createdAt,
        },
        ...current,
      ]);
      addToast({
        type: "success",
        title: "Demande acceptée",
        message: `${request.requester.username} est maintenant dans votre liste d'amis.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Action impossible",
        message: getErrorMessage(err, "Impossible d'accepter cette demande."),
      });
    } finally {
      setAcceptingId(null);
    }
  };

  const handleDecline = async (request: FriendRequestWithPlayerDto) => {
    setDecliningId(request.id);
    try {
      await friendsApi.decline(request.id);
      setIncoming((current) => current.filter((item) => item.id !== request.id));
      addToast({
        type: "info",
        title: "Demande refusée",
        message: `${request.requester.username} sera notifié de votre choix.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Action impossible",
        message: getErrorMessage(err, "Impossible de refuser cette demande."),
      });
    } finally {
      setDecliningId(null);
    }
  };

  const tabs: Array<{ id: FriendsTab; label: string; count: number }> = [
    { id: "incoming", label: "Demandes reçues", count: incoming.length },
    { id: "outgoing", label: "Demandes envoyées", count: outgoing.length },
    { id: "friends", label: "Mes amis", count: friends.length },
  ];

  return (
    <div className="mx-auto box-border w-full max-w-[1120px] px-6 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-[28px] font-bold tracking-normal text-[var(--color-text-primary)]">
          Amis
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Gérez vos demandes en attente et retrouvez les joueurs acceptés.
        </p>
      </div>

      {loading && (
        <div className="flex min-h-[320px] items-center justify-center text-[var(--color-text-muted)]">
          <Loader2 size={22} className="mr-3 animate-spin" />
          Chargement…
        </div>
      )}

      {!loading && error && (
        <div className="border border-[rgba(244,87,87,0.28)] bg-[rgba(244,87,87,0.08)] px-5 py-4 text-sm font-semibold text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <div className="border-b border-[var(--color-border)] bg-[rgba(255,255,255,0.015)] px-4 py-3">
            <div className="inline-flex max-w-full flex-wrap gap-1 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg-3)] p-1">
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "group relative flex min-h-9 cursor-pointer items-center gap-2 rounded-[6px] px-3.5 text-sm font-bold outline-none transition",
                    "focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.36)] focus-visible:ring-offset-0",
                    selected
                      ? "bg-[var(--color-bg-2)] text-[var(--color-text-primary)] shadow-[0_1px_0_rgba(255,255,255,0.04),0_10px_24px_rgba(0,0,0,0.18)]"
                      : "text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.035)] hover:text-[var(--color-text-primary)]",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  <span
                    className={[
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-black transition",
                      selected
                        ? "bg-[rgba(201,169,110,0.18)] text-[var(--color-gold)]"
                        : "bg-[rgba(255,255,255,0.045)] text-[var(--color-text-muted)] group-hover:bg-[rgba(255,255,255,0.07)]",
                    ].join(" ")}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
            </div>
          </div>

          <div className="border-b border-[var(--color-border)] px-5 py-4">
            <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-text-primary)]">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
              {activeTab === "incoming" && `${incoming.length} demande${incoming.length !== 1 ? "s" : ""} à traiter`}
              {activeTab === "outgoing" && `${outgoing.length} demande${outgoing.length !== 1 ? "s" : ""} en attente`}
              {activeTab === "friends" && `${friends.length} joueur${friends.length !== 1 ? "s" : ""} accepté${friends.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="min-h-[220px]">
            {activeTab === "incoming" && incoming.length === 0 && (
              <EmptyState
                title="Aucune demande reçue"
                description="Les invitations envoyées par les autres joueurs apparaîtront ici."
              />
            )}

            {activeTab === "incoming" && incoming.length > 0 && (
              incoming.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  direction="incoming"
                  accepting={acceptingId === request.id}
                  declining={decliningId === request.id}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))
            )}

            {activeTab === "outgoing" && outgoing.length === 0 && (
              <EmptyState
                title="Aucune demande envoyée"
                description="Depuis la page Joueurs, recherchez un joueur puis envoyez-lui une demande."
              />
            )}

            {activeTab === "outgoing" && outgoing.length > 0 && (
              outgoing.map((request) => (
                <RequestRow key={request.id} request={request} direction="outgoing" />
              ))
            )}

            {activeTab === "friends" && friends.length === 0 && (
              <EmptyState
                title="Aucun ami pour l'instant"
                description="Acceptez une demande pour faire apparaître le joueur dans cette liste."
              />
            )}

            {activeTab === "friends" && friends.length > 0 && (
              friends.map((friend) => <FriendRow key={friend.requestId} friend={friend} />)
            )}
          </div>
        </section>
      )}
    </div>
  );
}
