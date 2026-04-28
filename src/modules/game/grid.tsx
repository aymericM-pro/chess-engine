import { useState } from "react";

const ROWS = 8;
const COLS = 8;

const initialGrid = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => ({ row, col, value: null })),
);

export default function Grid2D() {
  const [grid] = useState(initialGrid);

  return (
    <div className="grid">
      {grid.map((row, r) =>
        row.map((cell, c) => (
          <div key={`${r}-${c}`} className="cell" data-row={r} data-col={c}>
            {cell.value}
          </div>
        )),
      )}
    </div>
  );
}
