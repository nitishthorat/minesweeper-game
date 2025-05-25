import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const Cell = ({
  value,
  isRevealed,
  isFlagged,
  onPress,
  onLongPress,
  clickedMine,
}) => {
  let display = "";

  const getNumberColor = (val) => {
    switch (val) {
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "red";
      case 4:
        return "darkblue";
      case 5:
        return "brown";
      case 6:
        return "cyan";
      case 7:
        return "black";
      case 8:
        return "gray";
      default:
        return "black";
    }
  };

  if (isFlagged) {
    display = "🚩";
  } else if (isRevealed) {
    if (value === "M") {
      display = clickedMine ? "💥" : "💣";
    } else {
      display = value;
    }
  }
  return (
    <TouchableOpacity
      style={[styles.cell, isRevealed ? styles.revealed : styles.covered]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text
        style={[
          styles.text,
          typeof value === "number" &&
            isRevealed && {
              color: getNumberColor(value),
            },
        ]}
      >
        {display}
      </Text>
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
