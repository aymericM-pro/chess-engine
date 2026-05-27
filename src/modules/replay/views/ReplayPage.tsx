import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { GameHeader } from "../components/GameHeader";
import { PlayerBar } from "../components/PlayerBar";
import { BoardSection } from "../components/BoardSection";
import { AnalysisCard } from "../components/AnalysisCard";
import { MoveList } from "../components/MoveList";
import { ThemePicker } from "../components/ThemePicker";

export function ReplayPage() {
  useKeyboardNav();

  return (
    <div className="relative z-10 w-full max-w-[1080px] flex flex-col items-center gap-4 mx-auto">
      <section id="game" className="w-full flex flex-col items-center gap-4">
        <GameHeader />
        <PlayerBar />
        <div className="flex gap-4 items-start w-full flex-col md:flex-row md:items-start">
          <BoardSection />
          <aside
            className="flex-1 flex flex-col gap-3 min-w-0 w-full md:w-auto"
            style={{ height: "calc(var(--sidebar-h, auto))" }}
          >
            <AnalysisCard />
            <MoveList />
          </aside>
        </div>
      </section>
      <ThemePicker />
    </div>
  );
}
