import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import GameScreen from "./screens/GameScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <GameScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
});
