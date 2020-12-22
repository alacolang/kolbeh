import colors from "colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { IconSvg } from "components/icon";
import { FormattedText } from "components/formatted-text";

type HeaderProps = { title: string };

export function Header({ title }: HeaderProps) {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="cloud"
        size={55}
        color={colors[9]}
        style={headerStyles.cloud1}
      />
      <FormattedText style={headerStyles.title}>{title}</FormattedText>
      <IconSvg
        name="cloud"
        size={20}
        color={colors[9]}
        style={headerStyles.cloud2}
      />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 30,
    marginTop: 30,
  },
  cloud1: { position: "absolute", left: -8, top: 0 },
  title: {
    fontSize: 30,
    color: colors.backgroundPrimaryThird,
  },
  cloud2: {
    position: "absolute",
    right: 16,
    bottom: 15,
  },
});
