import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Loading = () => {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});

export default Loading;
