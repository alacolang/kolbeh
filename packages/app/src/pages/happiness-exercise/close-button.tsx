import colors from "colors";
import { GaussIcon } from "components/curve-icon";
import React from "react";
import { StyleSheet, View } from "react-native";

type CloseButtonProps = { onPress: () => void };
export function CloseButton({ onPress }: CloseButtonProps) {
  return (
    <View style={closeButtonStyles.container}>
      <GaussIcon
        onPress={() => onPress()}
        icon="timesFill"
        backgroundColor="white"
        color={colors.secondary}
      />
    </View>
  );
}
const closeButtonStyles = StyleSheet.create({
  container: {
    height: 80,
    width: 40,
  },
});
