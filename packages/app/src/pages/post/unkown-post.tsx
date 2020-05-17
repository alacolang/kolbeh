import React from "react";
import { View, StyleSheet } from "react-native";
import { FormattedText } from "components/formatted-text";
import colors from "colors";

const UnknownPost = () => {
  return (
    <View style={styles.container}>
      <FormattedText id="unknown-post" style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 24,
    color: colors.primary,
    textAlign: "center",
    lineHeight: 24 * 1.5,
  },
});

export default UnknownPost;
