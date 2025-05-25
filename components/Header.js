import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Header = ({
  flagsLeft,
  isFlagMode,
  toggleFlagMode,
  onRestart,
  timer,
  onHint,
  hintDisabled,
  faceEmoji,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{String(flagsLeft).padStart(3, "0")}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.squareButton, isFlagMode && styles.active]}
          onPress={toggleFlagMode}
        >
          <Text style={styles.icon}>🚩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.squareButton}
          onPress={onHint}
          disabled={hintDisabled}
        >
          <Text style={[styles.icon, hintDisabled && { opacity: 0.3 }]}>
            💡
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareButton} onPress={onRestart}>
          <Text style={styles.icon}>{faceEmoji()}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>{String(timer).padStart(3, "0")}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
    marginVertical: 10,
  },
  counter: {
    fontSize: 32,
    fontFamily: "Courier",
    backgroundColor: "black",
    color: "red",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  squareButton: {
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#aaa",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    shadowColor: "#444",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 20,
    color: "black",
  },
  active: {
    backgroundColor: "#555",
    borderColor: "#444",
  },
});
