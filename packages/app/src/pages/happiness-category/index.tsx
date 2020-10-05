import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import colors from "colors";
import BackImg from "components/icon/images/back.png";
import { FormattedText } from "components/formatted-text";
import Markdown from "react-native-easy-markdown";
import { resolveURL } from "utils/resolve";
import { IconSvg } from "components/icon";
import * as Types from "types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHappiness } from "context/happiness";

const fullWidth = Dimensions.get("window").width;

const Header = ({ navigation, route }: Props) => {
  const { category } = route.params;

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Image source={BackImg} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>
      <FormattedText style={styles.title}>{category.title}</FormattedText>
    </View>
  );
};

type Props = StackScreenProps<HomeStackParamList, "happinessCategory">;
function HappinessCategory({ navigation, route }: Props) {
  const { category } = route.params;
  const happiness = useHappiness();

  useEffect(() => {
    happiness.update();
  }, []);

  console.log({ category }, happiness.exercises);

  function handlePress(exercise: Types.IExercise) {
    navigation.navigate("happinessExercise", { exercise, category });
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <Header navigation={navigation} route={route} />
      <View style={styles.container}>
        <Markdown markdownStyles={markdownStyles}>{category.about}</Markdown>
        <View style={styles.contentContainer}>
          <View style={styles.verticalLine}>
            <View style={styles.verticalLineInner} />
          </View>
          <View style={styles.exercisesContainer}>
            {category.exercises?.map(
              (exercise: Types.IExercise, index: number) => {
                const state =
                  happiness.exercises[exercise.id]?.state ?? "locked";
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
                      color={colors.secondaryThird}
                      style={styles.icon}
                    />
                    <FormattedText style={styles.exerciseTitle}>
                      {exercise.title}
                    </FormattedText>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
          <Image
            source={{ uri: resolveURL(category.image.url) }}
            resizeMode="contain"
            style={styles.categoryImage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: { backgroundColor: colors.backgroundVariant, flex: 1 },
  container: { borderWidth: 0, paddingHorizontal: 30 },
  contentContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  verticalLineInner: {
    width: 5,
    backgroundColor: "#FFC3B6",
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
  categoryImage: {
    width: fullWidth / 2.2,
    height: (fullWidth / 2.2) * 1.6,
    borderColor: "red",
  },
  exercisesContainer: {
    // borderWidth: 1,
  },
  exerciseContainer: {
    flexDirection: "row",
    height: 65,
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    paddingTop: 10,
    backgroundColor: colors.backgroundVariant,
  },
  backIcon: {
    width: 40,
    height: 84,
    borderWidth: 0,
    borderColor: "black",
  },
  back: { width: 44, height: 84, borderWidth: 0 },
  title: {
    marginHorizontal: 30,
    fontSize: 28,
    // fontWeight: 'bold',
    color: colors.secondary,
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
    fontWeight: "bold",
    fontSize: 24,
  },
  h3: {
    color: colors.h3,
    paddingVertical: 20,
    fontWeight: "bold",
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
