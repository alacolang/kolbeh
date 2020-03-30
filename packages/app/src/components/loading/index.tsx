import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import colors from "../../colors";

const Loading = () => {
  return (
    <View style={styles.container}>
      {/* <Text>Loading...</Text> */}
      <ActivityIndicator size="large" color={colors.orange} animating />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
