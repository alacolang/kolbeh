import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import Markdown from "react-native-easy-markdown";
import { IconSvg } from "components/icon";
import * as Types from "types";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHappiness } from "context/happiness";
import { trackEvent } from "utils/analytics";
import Gif, { IMAGES } from "../happiness-training/Gif";

type Props = StackScreenProps<HomeStackParamList, "happinessCategory">;
function HappinessCategory({ navigation, route }: Props) {
  const { category } = route.params;
  const happiness = useHappiness();

  useEffect(() => {
    happiness.update();
    trackEvent("happiness-screen", { category: category.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePress(exercise: Types.IExercise) {
    navigation.navigate("happinessExercise", { exercise, category });
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <Markdown markdownStyles={markdownStyles}>{category.about}</Markdown>
        <View style={{ marginTop: 16 }} />
      </ScrollView>
      <View style={styles.contentContainer}>
        <View style={styles.endingTextOpacity} />
        <View style={styles.verticalLine}>
          <View style={styles.verticalLineInner} />
        </View>
        <View style={styles.exercisesContainer}>
          {category.exercises?.map((exercise: Types.IExercise) => {
            const state = happiness.exercises[exercise.id]?.state ?? "locked";
            return (
              <TouchableOpacity
                disabled={state === "locked"}
                key={exercise.title}
                onPress={() => handlePress(exercise)}
                style={styles.exerciseContainer}
              >
                <IconSvg
                  name={
                    state === "locked"
                      ? "lockFill"
                      : state === "done"
                      ? "tickFill"
                      : "circle"
                  }
                  size="small"
                  color={colors.backgroundPrimaryVariant}
                  style={styles.icon}
                />
                <FormattedText style={styles.exerciseTitle}>
                  {exercise.title}
                </FormattedText>
              </TouchableOpacity>
            );
          })}
        </View>
        <Gif image={IMAGES[category.id]} dropShadow />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: { backgroundColor: colors.backgroundLight, flex: 1 },
  container: { paddingHorizontal: 32 },
  contentContainer: {
    marginHorizontal: 32,
    marginBottom: 16,
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  verticalLineInner: {
    width: 5,
    backgroundColor: colors.backgroundPrimary,
    flexGrow: 1,
    left: 15,
    marginBottom: 38,
    marginTop: 5,
  },
  verticalLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  endingTextOpacity: {
    position: "absolute",
    top: -32 - 16,
    borderWidth: 0,
    left: 0,
    right: 0,
    height: 32,
    width: "120%",
    backgroundColor: "#F0F5FFa0",
  },
  exercisesContainer: {
    flexGrow: 1,
  },
  exerciseContainer: {
    flexDirection: "row",
    height: 60,
    zIndex: 1,
  },
  exerciseTitle: {
    color: colors.primary,
    fontSize: 18,
    paddingRight: 10,
    top: -3,
  },
  icon: {
    backgroundColor: colors.backgroundVariant,
  },
});

const markdownStyles = {
  listItemBullet: {
    width: 6,
    height: 6,
    backgroundColor: colors.green,
    borderRadius: 3,
    marginRight: 10,
  },
  h1: {
    color: colors.h1,
    textAlign: "center",
    paddingVertical: 20,
    fontWeight: "bold",
    fontSize: 24,
  },
  h2: {
    color: colors.h2,
    paddingVertical: 20,
    // fontWeight: "bold",
    fontSize: 24,
  },
  h3: {
    color: colors.h3,
    paddingVertical: 20,
    // fontWeight: "bold",
    fontSize: 24,
  },
  text: {
    fontFamily: "IRANYekanRDMobile",
    textAlign: "left",
    color: colors.primary,
    fontSize: 18,
    lineHeight: 2 * 16,
  },
};

export default HappinessCategory;
