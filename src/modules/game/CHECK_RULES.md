# Gestion de l'échec

## Principe

Quand le roi d'un joueur est en échec, ce joueur **ne peut jouer que des coups qui suppriment l'échec**. Il existe trois façons de le faire :

1. **Déplacer le roi** vers une case non attaquée.
2. **Interposer une pièce** entre le roi et la pièce attaquante (uniquement si l'attaque est une glissade : tour, fou, dame).
3. **Capturer la pièce attaquante** avec n'importe quelle pièce alliée.

Si aucune de ces trois options n'est possible : **échec et mat**.

---

## Implémentation

### Étape 1 — Détecter l'échec

`isSquareAttacked(board, r, c, byColor)` existe déjà dans `boardGame.ts`.  
Il suffit de localiser le roi dans le plateau, puis d'appeler cette fonction :

```ts
function isInCheck(board: Board, color: Color): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}K`) {
        const opponent: Color = color === "w" ? "b" : "w";
        return isSquareAttacked(board, r, c, opponent);
      }
    }
  }
  return false;
}
```

### Étape 2 — Filtrer les coups illégaux

Un coup est légal **si et seulement si** le roi n'est pas en échec après l'avoir joué.  
Ce filtre s'applique à **toutes les pièces**, pas seulement au roi :

```ts
function filterLegal(
  moves: [number, number][],
  board: Board,
  from: [number, number],
  color: Color,
): [number, number][] {
  return moves.filter(([tr, tc]) => {
    const next = board.map((row) => [...row]) as Board;
    next[tr][tc] = next[from[0]][from[1]];
    next[from[0]][from[1]] = null;
    return !isInCheck(next, color);
  });
}
```

Ce filtre s'insère dans `computeLegalMoves` (et dans `getCastlingMoves` pour le roque).

### Étape 3 — Intégrer dans `clickCell`

Quand une pièce est sélectionnée, les coups retournés doivent déjà être filtrés.  
Après chaque coup joué, calculer `isInCheck` pour le joueur suivant et stocker le résultat dans le state (`inCheck: boolean`).

---

## Conséquences sur l'UI

- **Roi en échec** : surbrillance rouge de la case du roi.
- **Pièce non déplaçable** : si après sélection aucun coup légal n'existe pour cette pièce (tous exposent le roi), `legalMoves` est vide → pas de feedback de coup possible.
- **Échec et mat / Pat** : si `legalMoves` est vide pour toutes les pièces du joueur actif :
  - en échec → mat, adversaire gagne
  - pas en échec → pat, nulle

---

## Ce qui change dans `BoardGameState`

```ts
inCheck: boolean  // true si le joueur dont c'est le tour est en échec
```

Calculé après chaque coup dans `clickCell` et `promote`.
