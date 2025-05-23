import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Cell = ({ value, isRevealed, isFlagged, onPress, onLongPress }) => {
  let display = "";

  if (isFlagged) {
    display = "🚩";
  } else if (isRevealed) {
    display = value === "M" ? "💣" : value || "";
  }
  return (
    <TouchableOpacity
      style={[styles.cell, isRevealed ? styles.revealed : styles.covered]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.text}>{display}</Text>
    </TouchableOpacity>
  );
};

export default Cell;

const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    margin: 1,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  covered: {
    backgroundColor: "#777",
  },
  revealed: {
    backgroundColor: "#ccc",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
