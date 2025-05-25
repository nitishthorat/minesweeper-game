import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Grid from "../components/Grid";
import Header from "../components/Header";

const MODE_CONFIG = {
  easy: { rows: 8, cols: 8, numMines: 10 },
  normal: { rows: 12, cols: 12, numMines: 20 },
  hard: { rows: 16, cols: 16, numMines: 40 },
  expert: { rows: 20, cols: 24, numMines: 99 },
};
const MAX_HINTS = 3;

const GameScreen = () => {
  const [gameConfig, setGameConfig] = useState(MODE_CONFIG["easy"]);
  const createEmptyGrid = () => {
    return Array.from({ length: gameConfig.rows }, (_, row) =>
      Array.from({ length: gameConfig.cols }, (_, col) => ({
        id: `${row}-${col}`,
        value: "",
        isRevealed: false,
        isFlagged: false,
        clickedMine: false,
      }))
    );
  };

  const [grid, setGrid] = useState(createEmptyGrid());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(gameConfig.numMines);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [modeMenuVisible, setModeMenuVisible] = useState(false);

  useEffect(() => {
    if (isGameOver && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isGameOver]);

  const handleRestart = (mode = null) => {
    const newConfig = mode ? MODE_CONFIG[mode] : gameConfig;
    setGameConfig(newConfig);

    const newGrid = Array.from({ length: newConfig.rows }, (_, row) =>
      Array.from({ length: newConfig.cols }, (_, col) => ({
        id: `${row}-${col}`,
        value: "",
        isRevealed: false,
        isFlagged: false,
        clickedMine: false,
      }))
    );

    setGrid(newGrid);
    setIsGameStarted(false);
    setIsFlagMode(false);
    setFlagsLeft(newConfig.numMines);
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
        onRestart={() => {
          setModeMenuVisible(true);
        }}
        timer={timer}
        onHint={handleHint}
        hintDisabled={hintsUsed >= MAX_HINTS}
        faceEmoji={getFaceEmoji}
      />
      {modeMenuVisible && (
        <TouchableWithoutFeedback onPress={() => setModeMenuVisible(false)}>
          <View style={styles.modeMenu}>
            {Object.keys(MODE_CONFIG).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => {
                  setModeMenuVisible(false);
                  handleRestart(mode);
                }}
                style={styles.modeOption}
              >
                <Text style={styles.modeText}>{mode.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.gridWrapper}>
        <Grid
          grid={grid}
          setGrid={setGrid}
          isGameStarted={isGameStarted}
          setIsGameStarted={setIsGameStarted}
          rows={gameConfig.rows}
          cols={gameConfig.cols}
          numMines={gameConfig.numMines}
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
  modeMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // semi-transparent backdrop
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
