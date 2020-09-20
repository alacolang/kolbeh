import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Markdown from "react-native-easy-markdown";
import colors from "colors";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IdeaImg from "assets/images/exercise-idea.png";
import CurveImg from "assets/images/back-curve-active.png";
import { IconSvg } from "components/icon";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FormattedText } from "components/formatted-text";

type Props = StackScreenProps<HomeStackParamList, "happinessExercise">;
function HappinessExercise({ navigation, route }: Props) {
  const { exercise } = route.params;

  console.log({ exercise });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.secondary,
      }}
    >
      <View style={styles.container}>
        <Header title={exercise.title} />
        <Markdown markdownStyles={markdownStyles}>
          {exercise.description}
        </Markdown>
      </View>
      <Idea />
      <View style={{ position: "absolute", left: 0, bottom: 40 }}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

function Idea() {
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        alignItems: "flex-end",
        borderWidth: 0,
        marginTop: 10,
        marginBottom: 36,
        marginHorizontal: 25,
      }}
    >
      <Image source={IdeaImg} style={{ width: 160 }} resizeMode="contain" />
    </TouchableOpacity>
  );
}

type BackButtonProps = { onPress: () => void };
function BackButton({ onPress }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={{
        height: 80,
        justifyContent: "center",
        borderWidth: 0,
      }}
    >
      <Image source={CurveImg} style={{ width: 50 }} resizeMode="contain" />
      <View
        style={{
          position: "absolute",
          borderWidth: 0,
          top: 22,
        }}
      >
        <IconSvg name="tickFill" size="medium" color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

type HeaderProps = { title: string };
function Header({ title }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 30,
        // borderWidth: 1,
      }}
    >
      <IconSvg
        name="cloud"
        size={60}
        color="white"
        style={{ position: "absolute", left: 0, top: 0 }}
      />
      <FormattedText
        style={{
          fontSize: 36,
          color: "white",
          // borderWidth: 1,
        }}
      >
        {title}
      </FormattedText>
      <IconSvg
        name="cloud"
        size={20}
        color="white"
        style={{
          position: "absolute",
          right: 0,
          bottom: 30,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderWidth: 0, paddingHorizontal: 30 },
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
    color: "white",
    fontSize: 22,
    // marginVertical: 15,
    lineHeight: 2 * 16,
  },
};

export default HappinessExercise;
