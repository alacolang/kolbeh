import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Markdown from "react-native-easy-markdown";
import colors from "colors";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurveImg from "assets/images/back-curve-active.png";
import { IconSvg } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { ScrollView } from "react-native-gesture-handler";
import rewardDailyImg from "assets/images/reward-daily.png";
import { useHappiness } from "context/happiness";

const fullWidth = Dimensions.get("window").width;

type Props = StackScreenProps<HomeStackParamList, "happinessExercise">;
function HappinessExercise({ navigation, route }: Props) {
  const { exercise, category } = route.params;

  const happiness = useHappiness();
  const [isAlreadyDone] = useState(
    happiness.exercises[exercise.id].state === "done"
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.secondary,
      }}
    >
      <View style={styles.container}>
        <Header title={exercise.title} goBack={() => navigation.goBack()} />
        <Markdown markdownStyles={markdownStyles}>
          {exercise.description}
        </Markdown>
      </View>
      <Idea title={exercise.title} categoryID={category.id} />
      {isAlreadyDone ? null : (
        <Done
          handleDone={() => {
            happiness.markExerciseAsDone(exercise.id);
          }}
          isCategoryDone={() => happiness.isCategoryDone(category)}
          handleAfterDone={() => {
            navigation.navigate("home");
          }}
        />
      )}
    </SafeAreaView>
  );
}

type IdeaProps = { categoryID: string; title: string };
function Idea({ title, categoryID }: IdeaProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}
      >
        <View style={ideaStyles.modal}>
          <View style={ideaStyles.container}>
            <FormattedText style={ideaStyles.text}>
              {title + " "}‍
            </FormattedText>
            <ScrollView style={ideaStyles.list}>
              {["عکس مامان", "صدای باد", "وانیل"].map((x) => (
                <FormattedText key={x} style={{ fontSize: 20 }}>
                  {x}
                </FormattedText>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSvg name="tickOutline" size="medium" color="#00DE76" />
            </TouchableOpacity>
            <View style={ideaStyles.imageContainer}>
              <IconSvg
                name={`happinessToolbox-${categoryID}`}
                size={70}
                color={colors.secondary}
              />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={ideaStyles.button}
      >
        <IconSvg
          name={`happinessToolbox-${categoryID}`}
          size={120}
          color="white"
        />
      </TouchableOpacity>
    </>
  );
}
const ideaStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  container: {
    width: "80%",
    borderRadius: 25,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundVariant,
    // backgroundColor: 'red',
    paddingVertical: 16,
    alignItems: "center",
    paddingHorizontal: 32,
    zIndex: 100,
    opacity: 1,
  },
  text: { fontSize: 24, color: "#00DE76" },
  list: {
    alignSelf: "flex-start",
    marginVertical: 16,
    maxHeight: fullWidth,
  },
  imageContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  button: {
    alignItems: "flex-end",
    borderWidth: 0,
    marginTop: 10,
    marginBottom: 36,
    marginHorizontal: 25,
  },
});

type DoneButtonProps = { onPress: () => void };
function DoneButton({ onPress }: DoneButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={doneButtonStyles.container}
    >
      <Image
        source={CurveImg}
        style={doneButtonStyles.backgroundImage}
        resizeMode="contain"
      />
      <View style={doneButtonStyles.iconContainer}>
        <IconSvg name="tickOutline" size="medium" color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}
const doneButtonStyles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: "center",
    borderWidth: 0,
  },
  backgroundImage: { width: 50 },
  iconContainer: {
    position: "absolute",
    borderWidth: 0,
    top: 22,
  },
});

type DoneProps = {
  handleDone: () => void;
  handleAfterDone: () => void;
  isCategoryDone: () => boolean;
};
function Done({ handleDone, handleAfterDone, isCategoryDone }: DoneProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          handleAfterDone();
        }}
      >
        <View style={doneStyles.modal}>
          <View style={doneStyles.container}>
            <View style={doneStyles.innerContainer}>
              <FormattedText
                style={doneStyles.text}
                id={isCategoryDone() ? "reward.category" : "reward.exercise"}
              />

              <View style={doneStyles.imageContainer}>
                <Image
                  source={rewardDailyImg}
                  style={doneStyles.image}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleAfterDone();
              }}
            >
              <IconSvg name="tickOutline" size="medium" color="#00DE76" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={doneStyles.button}>
        <DoneButton
          onPress={() => {
            handleDone();
            setModalVisible(true);
          }}
        />
      </View>
    </>
  );
}
const doneStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  container: {
    width: "80%",
    borderRadius: 25,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundVariant,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.8,
    color: colors.primary,
    width: Math.min(fullWidth / 1.8, 180),
  },
  imageContainer: {
    right: -30,
    top: 30,
  },
  image: { width: 100, height: 200, borderWidth: 0 },
  button: { position: "absolute", left: 0, bottom: 40 },
});

type HeaderProps = { title: string; goBack: () => void };
function Header({ title, goBack }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 30,
      }}
    >
      <IconSvg
        name="cloud"
        size={60}
        color="white"
        style={{ position: "absolute", left: -8, top: 16 }}
      />
      <FormattedText
        style={{
          fontSize: 36,
          color: "white",
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
          right: 30,
          bottom: 15,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: -25,
          top: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => goBack()}
          style={{ width: 44, height: 44 }}
        >
          <IconSvg name="timesFill" size="small" color="white" />
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
    // marginVertical: 15,
    lineHeight: 2 * 16,
  },
};

export default HappinessExercise;
