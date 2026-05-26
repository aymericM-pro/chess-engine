import { BookOpen, Crown, Flag, Shield, Swords } from "lucide-react";
import { IconTile } from "@/shared/components/IconTile";
import { useSidebar } from "@/shared/components/Sidebar";

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

export function ChessRulesSidebar() {
  return (
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
  );
}

export function useOpenChessRulesSidebar() {
  const { openSidebar } = useSidebar();

  return () => openSidebar(ChessRulesSidebar, {}, {
    title: "Règles des échecs",
    description: "Les bases pour jouer une partie complète.",
    icon: <IconTile icon={BookOpen} tone="gold" size="sm" />,
    closeLabel: "Fermer les règles",
    width: 520,
    bodyClassName: "px-7 py-6",
    footer: (
      <span className="font-display text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-text-muted">
        Aide de jeu
      </span>
    ),
  });
}
