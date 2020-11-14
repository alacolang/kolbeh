import { StackHeaderProps } from "@react-navigation/stack";
import colors from "colors";
import { GaussIcon } from "components/curve-icon";
import { FormattedText } from "components/formatted-text";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 30,
    fontSize: 28,
    color: colors[1],
  },
});

export const JustBackHeader = ({
  navigation,
}: StackHeaderProps & { color?: string; backgroundColor?: string }) => {
  return (
    <SafeAreaView>
      <View
        style={{
          position: "absolute",
          left: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 80,
          marginTop: 6,
          zIndex: 1,
        }}
      >
        <GaussIcon onPress={() => navigation.goBack()} icon="rightArrow" />
      </View>
    </SafeAreaView>
  );
};

export const BackHeader = ({
  navigation,
  scene,
  title,
  transparent = false,
  backgroundColor = colors.backgroundLight,
  color,
  backIconBackgroundColor,
  backIconColor,
}: StackHeaderProps & {
  color?: string;
  title?: string | undefined;
  backgroundColor?: string;
  transparent?: boolean;
  backIconColor?: string;
  backIconBackgroundColor?: string;
}) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView
      style={transparent ? null : { backgroundColor: backgroundColor }}
    >
      <View style={backHeaderStyle.container}>
        <View style={backHeaderStyle.backContainer}>
          <GaussIcon
            onPress={() => navigation.goBack()}
            icon="rightArrow"
            color={backIconColor}
            backgroundColor={backIconBackgroundColor}
          />
        </View>
        <FormattedText style={[styles.title, { color: color ?? colors[1] }]}>
          {title ? title : t(`screen-title.${scene.route.name}`)}
        </FormattedText>
      </View>
    </SafeAreaView>
  );
};

const backHeaderStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginTop: 6,
    zIndex: 1,
  },
  backContainer: {
    position: "absolute",
    left: 0,
  },
});
