export type Color = "w" | "b";
export type PieceType = "P" | "R" | "N" | "B" | "Q" | "K";
export type Piece = `${Color}${PieceType}`;
export type Board = (Piece | null)[][];

export type Phase = "opening" | "middle" | "end";
export type TagType =
  | "attack"
  | "defense"
  | "strategy"
  | "tactic"
  | "opening"
  | "blunder";

export interface Move {
  s: string;
  f: [number, number];
  t: [number, number];
}

export interface AnalysisEntry {
  phase: Phase;
  san: string;
  who: string;
  text: string;
  tags: [TagType, string][];
}

export interface BoardTheme {
  id: string;
  name: string;
  light: string;
  dark: string;
}

export type GameResult = '1-0' | '0-1' | '1/2-1/2'

export interface GameRecord {
  id: string
  date: string
  white: { name: string; elo: number }
  black: { name: string; elo: number }
  result: GameResult
  opening: string
  timeControl: string
  moves: Move[]
  analysis: AnalysisEntry[]
}
