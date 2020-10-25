import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Markdown from "react-native-easy-markdown";
import colors from "colors";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSvg, IconSvgName } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import rewardDailyImg from "assets/images/reward-daily.png";
import rewardCertificateImg from "assets/images/reward-certificate.png";
import rewardMedalImg from "assets/images/reward-medal.png";
import { useHappiness } from "context/happiness";
import { GaussIcon } from "components/curve-icon";
import { Trans, useTranslation } from "react-i18next";
import { load, SOUND_NAMES, play, release } from "./sound";
import { trackEvent } from "utils/analytics";
import config from "config";

const fullWidth = Dimensions.get("window").width;

type Props = StackScreenProps<HomeStackParamList, "happinessExercise">;
function HappinessExercise({ navigation, route }: Props) {
  const { exercise, category } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const happiness = useHappiness();
  const [isAlreadyDone] = useState(
    happiness.exercises[exercise.id].state === "done"
  );

  useEffect(() => {
    async function helper() {
      await load(SOUND_NAMES);
      play("happiness_background", { volume: 0.3 });
    }
    helper();
    return function () {
      release();
    };
  }, []);

  useEffect(() => {
    trackEvent("happiness-screen", {
      exercise: exercise.id,
    });
  }, [category.id, exercise.id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.secondary,
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header title={exercise.title} />
        <Markdown markdownStyles={markdownStyles}>
          {exercise.description}
        </Markdown>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        {isAlreadyDone ? null : (
          <AddIdeaInput
            onPress={(idea: string) => {
              if (idea.trim() === "" && !config.isDevelopment) {
                return;
              }
              trackEvent("happiness-add-idea", {
                exercise: exercise.id,
              });
              happiness.addIdea(category.id, idea);
              happiness.markExerciseAsDone(exercise.id);
              setTimeout(() => setModalVisible(true), 100);
            }}
          />
        )}
      </KeyboardAvoidingView>
      <Feedback
        modalVisible={modalVisible}
        title={category.title}
        isCategoryDone={() => happiness.isCategoryDone(category)}
        isAllDone={happiness.isAllDone}
        handleAfterDone={() => {
          if (happiness.isCategoryDone(category)) {
            trackEvent("happiness-category-completed", {
              category: category.id,
              ideas: (happiness.ideas[category.id] ?? []).length,
            });
          }
          if (happiness.isAllDone()) {
            trackEvent("happiness-all-done");
          }
          navigation.navigate("home");
        }}
      />
      <View style={{ height: 140 }}>
        <Ideas
          ideas={happiness.ideas[category.id] ?? []}
          title={exercise.title}
          categoryID={category.id}
        />

        <View style={styles.close}>
          <CloseButton onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  close: { position: "absolute", left: 0, bottom: 40 },
});

type AddIdeaInputProps = { onPress: (text: string) => void };
const AddIdeaInput = ({ onPress }: AddIdeaInputProps) => {
  const { t } = useTranslation();
  const [idea, setIdea] = useState("");
  const disabled = idea.length < 2;
  return (
    <View
      style={{
        alignSelf: "center",
        flexDirection: "row",
        borderWidth: 0,
        marginHorizontal: 32,
      }}
    >
      <TextInput
        multiline
        numberOfLines={3}
        maxLength={200}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "white",
          paddingHorizontal: 16,
          borderRadius: 10,
          fontFamily: "IRANYekanRDMobile",
          fontSize: 18,
          color: "white",
          textAlign: "right",
        }}
        onChangeText={(text) => setIdea(text)}
        placeholder={t("happiness.exercise.ideaPlaceholder")}
        placeholderTextColor="white"
        value={idea}
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          onPress(idea);
          setIdea("");
          Keyboard.dismiss();
        }}
        style={{ position: "absolute", right: 10, top: 7.5, borderWidth: 0 }}
      >
        <IconSvg
          name="tickFill"
          size="tiny"
          color={disabled ? colors.primaryThird : "#eaeaea"}
        />
      </TouchableOpacity>
    </View>
  );
};

type IdeasProps = { categoryID: string; title: string; ideas: string[] };
function Ideas({ title, categoryID, ideas }: IdeasProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={ideasStyles.modal}>
          <View style={ideasStyles.container}>
            <FormattedText style={ideasStyles.text}>
              {title + " "}‍
            </FormattedText>
            <ScrollView style={ideasStyles.list}>
              {ideas
                .filter((x) => x.trim().length > 2)
                .map((idea) => (
                  <FormattedText key={idea} style={{ fontSize: 20 }}>
                    {idea}
                  </FormattedText>
                ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSvg name="tickOutline" size="small" color="#00DE76" />
            </TouchableOpacity>
            <View style={ideasStyles.imageContainer}>
              <IconSvg
                name={`happinessToolbox-${categoryID}` as IconSvgName}
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
        style={ideasStyles.button}
      >
        <IconSvg
          name={`happinessToolbox-${categoryID}` as IconSvgName}
          size={80}
          color="white"
        />
      </TouchableOpacity>
    </>
  );
}
const ideasStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryThird,
  },
  container: {
    width: "80%",
    borderRadius: 25,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundVariant,
    paddingVertical: 16,
    alignItems: "center",
    paddingHorizontal: 32,
    // zIndex: 100,
    // opacity: 1,
  },
  text: { fontSize: 24, color: "#00DE76" },
  list: {
    alignSelf: "flex-start",
    marginVertical: 24,
    maxHeight: fullWidth,
    width: "100%",
  },
  imageContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 36,
    marginHorizontal: 25,
  },
});

type CloseButtonProps = { onPress: () => void };
function CloseButton({ onPress }: CloseButtonProps) {
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

type FeedbackProps = {
  modalVisible: boolean;
  title: string;
  handleAfterDone: () => void;
  isCategoryDone: () => boolean;
  isAllDone: () => boolean;
};
const Feedback = ({
  title,
  modalVisible,
  handleAfterDone,
  isCategoryDone,
  isAllDone,
}: FeedbackProps) => {
  const sound = isAllDone()
    ? null
    : isCategoryDone()
    ? "reward_category"
    : "reward_exercise";

  React.useEffect(() => {
    if (modalVisible && sound) {
      play(sound, { stopAndPlay: true });
    }
  }, [sound, modalVisible]);

  const text = isAllDone()
    ? "happiness.reward.allDone"
    : isCategoryDone()
    ? "happiness.reward.category"
    : "happiness.reward.exercise";
  const image = isAllDone()
    ? rewardCertificateImg
    : isCategoryDone()
    ? rewardMedalImg
    : rewardDailyImg;
  return (
    <Modal
      animationType="fade"
      hardwareAccelerated
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        handleAfterDone();
      }}
    >
      <View style={feedbackStyles.modal}>
        <View style={feedbackStyles.container}>
          <View style={feedbackStyles.innerContainer}>
            <View style={feedbackStyles.textContainer}>
              {isAllDone() ? (
                <View>
                  <IconSvg name="certificate" size={55} color="red" />
                </View>
              ) : null}
              <FormattedText style={feedbackStyles.text}>
                <Trans
                  i18nKey={text}
                  values={{ title }}
                  components={[
                    <FormattedText
                      style={[
                        feedbackStyles.text,
                        { color: colors.greenVariant },
                      ]}
                    />,
                  ]}
                />
              </FormattedText>
            </View>
            <View style={feedbackStyles.imageContainer}>
              <Image
                source={image}
                style={feedbackStyles.image}
                resizeMode="contain"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleAfterDone();
            }}
            style={{ alignSelf: "center", position: "absolute", bottom: 24 }}
          >
            <IconSvg name="tickOutline" size="small" color="#00DE76" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const feedbackStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryThird,
  },
  container: {
    width: fullWidth - 2 * 36,
    // marginHorizontal: 36,
    borderRadius: 25,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundVariant,
    // paddingVertical: 16,
    // borderWidth: 3,
    // alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    // marginBottom: 16,
  },
  textContainer: {
    flexDirection: "column",
    paddingLeft: 36,
    width: fullWidth - 36 * 2 - 130,
    paddingTop: 16,
  },
  text: {
    // paddingLeft: 16,
    paddingTop: 16,
    fontSize: 18,
    lineHeight: 18 * 1.8,
    color: colors.primary,
    // borderWidth: 2,
    // borderColor: "green",
  },
  imageContainer: {
    // position: "absolute",
    right: -20,
    top: -20,
    // borderWidth: 1,
  },
  image: { width: 130, height: 130 * 2, borderWidth: 0 },
});

type HeaderProps = { title: string };
function Header({ title }: HeaderProps) {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="cloud"
        size={55}
        color={colors.secondaryVarient}
        style={headerStyles.cloud1}
      />
      <FormattedText style={headerStyles.title}>{title}</FormattedText>
      <IconSvg
        name="cloud"
        size={20}
        color={colors.secondaryVarient}
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
    color: "white",
  },
  cloud2: {
    position: "absolute",
    right: 16,
    bottom: 15,
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
    // fontWeight: "bold",
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
    color: "white",
    fontSize: 18,
    // marginVertical: 15,
    lineHeight: 2 * 16,
  },
};

export default HappinessExercise;
