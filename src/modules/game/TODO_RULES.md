# Règles d'échecs — état d'implémentation

## Fait

### Déplacements de base
Tous les 6 types de pièces sont implémentés via le pattern Strategy (`src/modules/game/strategy/`) :
- Pion : avance 1/2 cases, captures diagonales
- Cavalier, Fou, Tour, Dame, Roi : mouvements standards

### Promotion du pion ✓
- `clickCell` détecte un pion arrivant en dernière rangée
- `pendingPromotion: { row, col, color } | null` dans `BoardGameState`
- `promote(state, pieceType)` finalise le coup
- UI : modal plein écran avec sélection des 4 pièces (Dame, Tour, Fou, Cavalier)

### Roque ✓
- `movedPieces: Set<string>` dans `BoardGameState` trace les cases initiales des pièces ayant bougé
- `isSquareAttacked(board, r, c, byColor)` vérifie si une case est attaquée (gère la récursion roi↔roque)
- `getCastlingMoves` vérifie les 6 conditions : roi/tours jamais bougés, cases vides, roi pas en échec, cases traversées et d'arrivée non attaquées
- `clickCell` détecte un déplacement roi de 2 cases et déplace automatiquement la tour

---

## Restant à implémenter

### 1. Légalité réelle des coups — priorité haute

Actuellement, un coup est accepté dès qu'il est dans la liste brute de la stratégie, même s'il laisse le roi en échec. Il faut filtrer chaque coup candidat :

```
coup légal = coup candidat tel qu'après l'appliquer, le roi de la couleur qui joue n'est pas attaqué
```

`isSquareAttacked` existe déjà — il suffit de l'utiliser pour localiser le roi après chaque coup candidat et rejeter les coups qui l'exposent.

---

### 2. Échec, mat et pat

Une fois le filtrage en place :

- **Échec** : le joueur dont c'est le tour a son roi attaqué.
- **Échec et mat** : en échec + aucun coup légal → fin de partie, adversaire gagne.
- **Pat** : pas en échec + aucun coup légal → fin de partie, nulle.

À exposer via une fonction `getGameStatus(state)` appelée après chaque coup.

---

### 3. Prise en passant

Règle : un pion peut capturer en passant le pion adverse qui vient d'avancer de deux cases.

- Ajouter `enPassantCol: number | null` dans `BoardGameState` (colonne du pion venand de faire un double pas).
- `clickCell` met à jour ce champ après chaque coup.
- Dans `PawnStrategy`, si la case diagonale est vide mais correspond à `enPassantCol`, le coup est légal et retire le pion capturé.

---

### 4. Règles de nulle (optionnel)

- **Règle des 50 coups** : ajouter `halfMoveClock` dans `BoardGameState`, réinitialisé à chaque capture ou mouvement de pion.
- **Répétition de position** : nulle si la même position apparaît 3 fois (hash Zobrist ou sérialisation du plateau).
- **Matériel insuffisant** : nulle si aucun camp ne peut mater (roi seul, roi + fou, etc.).
