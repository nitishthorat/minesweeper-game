import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Grid from "../components/Grid";
import { generateGameGrid } from "../utils/generateGameGrid";

const rows = 8;
const cols = 8;
const numMines = 10;

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

  const handleRestart = () => {
    setGrid(createEmptyGrid());
    setIsGameStarted(false);
    setIsFlagMode(false);
    setFlagsLeft(numMines);
    setIsGameOver(false);
  };

  const toggleFlagMode = () => {
    setIsFlagMode((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleRestart} style={styles.controlButton}>
          <Text style={styles.buttonText}>🔁</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Minesweeper</Text>

        <TouchableOpacity onPress={toggleFlagMode} style={styles.controlButton}>
          <Text style={[styles.buttonText, isFlagMode && { color: "red" }]}>
            🚩 {isFlagMode ? "On" : "Off"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.flagsLeft}>Flags left: {flagsLeft}</Text>

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
      />
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  controlButton: {
    backgroundColor: "#444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  flagsLeft: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});
