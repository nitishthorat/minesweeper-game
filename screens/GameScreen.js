import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Grid from "../components/Grid";
import Header from "../components/Header";

const rows = 20;
const cols = 24;
const numMines = 99;

const createEmptyGrid = () => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      id: `${row}-${col}`,
      value: "",
      isRevealed: false,
      isFlagged: false,
    }))
  );
};

const GameScreen = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(numMines);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const MAX_HINTS = 3;
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    if (isGameOver && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isGameOver]);

  const handleRestart = () => {
    setGrid(createEmptyGrid());
    setIsGameStarted(false);
    setIsFlagMode(false);
    setFlagsLeft(numMines);
    setIsGameOver(false);
    setTimer(0);
    setHintsUsed(0);
    setGameStatus("playing");

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleFlagMode = () => {
    setIsFlagMode((prev) => !prev);
  };

  const onFirstClick = () => {
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => (prev < 999 ? prev + 1 : 999));
      }, 1000);
    }
  };

  const handleHint = () => {
    if (isGameOver || flagsLeft <= 0 || hintsUsed >= MAX_HINTS) return;

    const unflaggedMines = grid
      .flat()
      .filter(
        (cell) => cell.value === "M" && !cell.isFlagged && !cell.isRevealed
      );

    if (unflaggedMines.length === 0) return;

    const target =
      unflaggedMines[Math.floor(Math.random() * unflaggedMines.length)];
    const [row, col] = target.id.split("-").map(Number);

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = true;

    setGrid(newGrid);
    setFlagsLeft((prev) => Math.max(0, prev - 1));
    setHintsUsed((prev) => prev + 1);
  };

  const getFaceEmoji = () => {
    switch (gameStatus) {
      case "won":
        return "😎";
      case "lost":
        return "😵";
      default:
        return "🙂";
    }
  };

  return (
    <View style={styles.container}>
      <Header
        flagsLeft={flagsLeft}
        isFlagMode={isFlagMode}
        toggleFlagMode={toggleFlagMode}
        onRestart={handleRestart}
        timer={timer}
        onHint={handleHint}
        hintDisabled={hintsUsed >= MAX_HINTS}
        faceEmoji={getFaceEmoji}
      />

      <View style={styles.gridWrapper}>
        <Grid
          grid={grid}
          setGrid={setGrid}
          isGameStarted={isGameStarted}
          setIsGameStarted={setIsGameStarted}
          rows={rows}
          cols={cols}
          numMines={numMines}
          isFlagMode={isFlagMode}
          flagsLeft={flagsLeft}
          setFlagsLeft={setFlagsLeft}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          onFirstClick={onFirstClick}
          setGameStatus={setGameStatus}
        />
      </View>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#888",
    alignItems: "center",
  },
  gridWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
});
