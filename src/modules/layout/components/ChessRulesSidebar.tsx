import { BookOpen, Crown, Flag, Shield, Swords, X } from "lucide-react";
import { IconTile } from "@/shared/components/IconTile";

interface Props {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    icon: Crown,
    title: "But du jeu",
    lines: [
      "Mettre le roi adverse en échec et mat.",
      "Un roi est en échec quand il est attaqué.",
      "Il y a mat si aucune défense légale ne permet de sauver le roi.",
    ],
  },
  {
    icon: Swords,
    title: "Déplacement des pièces",
    lines: [
      "Le roi avance d'une case dans toutes les directions.",
      "La dame se déplace en ligne, colonne ou diagonale.",
      "La tour va en ligne ou colonne, le fou en diagonale.",
      "Le cavalier se déplace en L et peut sauter les pièces.",
      "Le pion avance d'une case, capture en diagonale et peut avancer de deux cases depuis sa position initiale.",
    ],
  },
  {
    icon: Shield,
    title: "Règles spéciales",
    lines: [
      "Le roque déplace le roi et une tour si aucune pièce ne bloque et si le roi n'est pas en danger.",
      "La prise en passant permet à un pion de capturer un pion qui vient d'avancer de deux cases.",
      "Un pion arrivé au bout du plateau est promu en dame, tour, fou ou cavalier.",
    ],
  },
  {
    icon: Flag,
    title: "Fin de partie",
    lines: [
      "Victoire par échec et mat, abandon ou temps écoulé.",
      "Nulle par pat, accord mutuel, répétition ou manque de matériel.",
      "En pat, le joueur au trait n'est pas en échec mais n'a aucun coup légal.",
    ],
  },
];

export function ChessRulesSidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 z-[200] flex w-[min(520px,100vw)] flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "var(--color-bg-2)", borderLeft: "1px solid var(--color-border)" }}
      >
        <header
          className="flex flex-shrink-0 items-center justify-between px-7 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <IconTile icon={BookOpen} tone="gold" size="sm" />
            <div>
              <span className="font-display block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-text-primary">
                Règles des échecs
              </span>
              <span className="mt-1 block text-xs font-semibold text-[var(--color-text-muted)]">
                Les bases pour jouer une partie complète.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="-mr-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#7d8490] transition-[background,color] duration-150 hover:bg-black/[0.18] hover:text-[#c6ccd5]"
            aria-label="Fermer les règles"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <div className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="border border-[var(--color-border)] bg-[rgba(255,255,255,0.018)] p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <IconTile icon={section.icon} tone="gold" size="sm" />
                  <h2 className="font-display text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--color-text-primary)]">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {section.lines.map((line) => (
                    <li key={line} className="flex gap-2 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                      <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-gold)]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <footer
          className="flex-shrink-0 px-7 py-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span className="font-display text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Aide de jeu
          </span>
        </footer>
      </aside>
    </>
  );
}
