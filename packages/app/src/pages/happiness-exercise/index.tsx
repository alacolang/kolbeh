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

const fullWidth = Dimensions.get("window").width;

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
        <Header title={exercise.title} goBack={() => navigation.goBack()} />
        <Markdown markdownStyles={markdownStyles}>
          {exercise.description}
        </Markdown>
      </View>
      <Idea title={exercise.title} />
      <Done handleDone={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

type IdeaProps = { title: string };
function Idea({ title }: IdeaProps) {
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
          }}
        >
          <View
            style={{
              width: "80%",
              borderRadius: 25,
              minHeight: fullWidth / 2,
              backgroundColor: colors.backgroundVarient,
              // backgroundColor: 'red',
              paddingVertical: 16,
              alignItems: "center",
              paddingHorizontal: 32,
              zIndex: 100,
              opacity: 1,
            }}
          >
            <FormattedText style={{ fontSize: 28, color: "#00DE76" }}>
              {title}‍
            </FormattedText>
            <ScrollView
              style={{
                alignSelf: "flex-start",
                marginVertical: 16,
                maxHeight: fullWidth,
              }}
            >
              {["عکس مامان", "صدای باد", "وانیل"].map((x) => (
                <FormattedText style={{ fontSize: 20 }}>{x}</FormattedText>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSvg name="tickOutline" size="medium" color="#00DE76" />
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                right: 10,
                top: 10,
              }}
            >
              <IconSvg name="exerciseIdea" size={70} color={colors.secondary} />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          alignItems: "flex-end",
          borderWidth: 0,
          marginTop: 10,
          marginBottom: 36,
          marginHorizontal: 25,
        }}
      >
        <IconSvg name="exerciseIdea" size={120} color="white" />
      </TouchableOpacity>
    </>
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
        <IconSvg name="tickOutline" size="medium" color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}

type Done = { handleDone: () => void };
function Done({ handleDone }: Done) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          handleDone();
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
          }}
        >
          <View
            style={{
              width: "80%",
              borderRadius: 25,
              minHeight: fullWidth / 2,
              backgroundColor: colors.backgroundVarient,
              paddingVertical: 16,
              paddingHorizontal: 32,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FormattedText
                style={{
                  fontSize: 20,
                  lineHeight: 20 * 1.5,
                  color: colors.primary,
                }}
                id="reward.daily"
              />

              <View
                style={{
                  right: -10,
                  top: 30,
                }}
              >
                <Image
                  source={rewardDailyImg}
                  style={{ width: 100, height: 200, borderWidth: 0 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleDone();
              }}
            >
              <IconSvg name="tickOutline" size="medium" color="#00DE76" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ position: "absolute", left: 0, bottom: 40 }}>
        <BackButton
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
    </>
  );
}

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
