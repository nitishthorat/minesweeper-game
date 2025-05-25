import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Cell from "./Cell";
import { generateGameGrid } from "../utils/generateGameGrid";

const Grid = ({
  grid,
  setGrid,
  isGameStarted,
  setIsGameStarted,
  rows,
  cols,
  numMines,
  isFlagMode,
  flagsLeft,
  setFlagsLeft,
  isGameOver,
  setIsGameOver,
  onFirstClick,
  setGameStatus,
}) => {
  const handlePress = (row, col) => {
    if (isGameOver) return;

    let newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.isRevealed) return;

    // Flag mode handling
    if (isFlagMode) {
      if (cell.isFlagged) {
        cell.isFlagged = false;
        setFlagsLeft(flagsLeft + 1);
      } else if (flagsLeft > 0) {
        cell.isFlagged = true;
        setFlagsLeft(flagsLeft - 1);
      }
      setGrid([...newGrid]);
      return;
    }

    // First click
    if (!isGameStarted) {
      newGrid = generateGameGrid(rows, cols, numMines, row, col);
      setIsGameStarted(true);
      onFirstClick();
    }

    const clickedCell = newGrid[row][col];
    if (clickedCell.isFlagged) return;

    // 🚨 Clicked a mine!
    if (clickedCell.value === "M") {
      revealAllMines(newGrid);
      clickedCell.isRevealed = true;
      setIsGameOver(true);
      setGameStatus("lost");
      setGrid([...newGrid]);
      return;
    }

    // Reveal logic
    if (clickedCell.value === "") {
      newGrid = floodFillReveal(newGrid, row, col);
    } else {
      clickedCell.isRevealed = true;
    }

    setGrid([...newGrid]);

    const allSafeRevealed = newGrid
      .flat()
      .every((cell) => cell.value === "M" || cell.isRevealed);

    if (allSafeRevealed) {
      setIsGameOver(true);
      setGameStatus("won"); // ✅ User won!
    }
  };

  const handleLongPress = (row, col) => {
    // Optional: support flagging via long-press regardless of flag mode
  };

  const floodFillReveal = (grid, row, col, visited = {}) => {
    const stack = [[row, col]];
    const directions = [-1, 0, 1];

    while (stack.length > 0) {
      const [r, c] = stack.pop();
      const key = `${r}-${c}`;

      if (r < 0 || r >= rows || c < 0 || c >= cols || visited[key]) continue;

      const cell = grid[r][c];
      if (cell.isRevealed || cell.isFlagged) continue;

      cell.isRevealed = true;
      visited[key] = true;

      if (cell.value === "") {
        for (let dr of directions) {
          for (let dc of directions) {
            if (dr === 0 && dc === 0) continue;
            stack.push([r + dr, c + dc]);
          }
        }
      }
    }

    return grid;
  };

  const revealAllMines = (grid) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].value === "M") {
          grid[r][c].isRevealed = true;
        }
      }
    }
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.grid}
      showsHorizontalScrollIndicator
    >
      <View>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <Cell
                key={cell.id}
                value={cell.value}
                isRevealed={cell.isRevealed}
                isFlagged={cell.isFlagged}
                onPress={() => handlePress(rowIndex, colIndex)}
                onLongPress={() => handleLongPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Grid;

const styles = StyleSheet.create({
  grid: {
    marginTop: 20,
    marginHorizontal: 20,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
