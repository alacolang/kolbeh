import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import colors from "colors";
import BackImg from "components/icon/images/back.png";
import { FormattedText } from "components/formatted-text";
import Markdown from "react-native-easy-markdown";
import { resolveURL } from "utils/resolve";
import { Icon } from "components/icon";
import * as Types from "types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { SafeAreaView } from "react-native-safe-area-context";

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

  console.log({ category });

  function handlePress(exercise: Types.IExercise) {
    navigation.navigate("happinessExercise", { exercise });
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.backgroundVarient }}>
      <Header navigation={navigation} route={route} />
      <View style={styles.container}>
        <Markdown markdownStyles={markdownStyles}>{category.about}</Markdown>
        <View style={styles.contentContainer}>
          <View style={styles.verticalLine}>
            <View style={styles.verticalLineInner} />
          </View>
          <View>
            {category.exercises.map(
              (exercise: Types.IExercise, index: number) => {
                const icon = index === 0 ? "circle" : "lockCircle";
                return (
                  <TouchableOpacity
                    key={exercise.title}
                    onPress={() => handlePress(exercise)}
                    style={styles.exerciseContainer}
                  >
                    <Icon name={icon} size="medium" style={styles.icon} />
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
  container: { borderWidth: 0, paddingHorizontal: 30 },
  contentContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  verticalLineInner: {
    width: 4,
    backgroundColor: "#FFC3B6",
    flexGrow: 1,
    left: 36,
    marginVertical: 36,
  },
  verticalLine: {
    flexGrow: 1,
  },
  categoryImage: {
    width: fullWidth / 2,
    height: (fullWidth / 2) * 1.6,
    // borderWidth: 1,
    borderColor: "red",
  },
  exerciseContainer: {
    flexDirection: "row",
    borderWidth: 0,
    height: 60,
    zIndex: 1,
  },
  exerciseTitle: {
    color: colors.primary,
    fontSize: 18,
    paddingLeft: 10,
    top: 5,
  },
  icon: {
    backgroundColor: colors.backgroundVarient,
    width: 48,
    height: 48,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    backgroundColor: colors.backgroundVarient,
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
    // color: colors.primary,
    color: "black",
    fontSize: 18,
    lineHeight: 2 * 16,
  },
};

export default HappinessCategory;
