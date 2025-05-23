export function generateGameGrid(rows, cols, numMines, safeRow, safeCol) {
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      id: `${r}-${c}`,
      value: "", // will be 'M' or number
      isRevealed: false,
      isFlagged: false,
    }))
  );

  // Exclude safe cell and its 8 neighbors
  const excludeSet = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr;
      const c = safeCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        excludeSet.add(`${r}-${c}`);
      }
    }
  }

  // Randomly place mines
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const id = `${r}-${c}`;

    if (!excludeSet.has(id) && grid[r][c].value !== "M") {
      grid[r][c].value = "M";
      minesPlaced++;
    }
  }

  // Calculate numbers
  const directions = [-1, 0, 1];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].value === "M") continue;

      let count = 0;
      for (let dr of directions) {
        for (let dc of directions) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr,
            nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            grid[nr][nc].value === "M"
          ) {
            count++;
          }
        }
      }

      grid[r][c].value = count > 0 ? count : "";
    }
  }

  return grid;
}
