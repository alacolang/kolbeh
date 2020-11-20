import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Markdown from "react-native-easy-markdown";
import colors from "colors";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
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
import { useHappiness } from "context/happiness";
import { GaussIcon } from "components/curve-icon";
import { Trans, useTranslation } from "react-i18next";
import { load, SOUND_NAMES, play, release } from "./sound";
import { trackEvent } from "utils/analytics";
import config from "config";
import rewardDailyImg from "../../assets/images/reward-daily.gif";
import rewardMedalImg from "../../assets/images/connection.gif";
import rewardCertificateImg from "../../assets/images/reward-certificate.gif";
import Gif from "pages/happiness-training/Gif";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;
const FOOTER_HEIGHT = 140;
const ADD_IDEA_HEIGHT = 120;

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
      play("happiness_background", { volume: 0.1 });
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
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          style={{ height: fullHeight - FOOTER_HEIGHT - ADD_IDEA_HEIGHT }}
        >
          <Header title={exercise.title} />
          <Markdown markdownStyles={markdownStyles}>
            {exercise.description}
            {exercise.description}
          </Markdown>
          <View style={{ marginTop: 16 }} />
        </ScrollView>
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              position: "absolute",
              top: -32 - 16,
              left: 0,
              right: 0,
              height: 32,
              width: "100%",
              backgroundColor: "#AF99F1a0",
            }}
          />

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
        </View>
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
        <View style={styles.footer}>
          <Ideas
            ideas={happiness.ideas[category.id] ?? []}
            title={exercise.title}
            categoryID={category.id}
          />

          <View style={styles.close}>
            <CloseButton onPress={() => navigation.goBack()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 30,
  },
  close: { position: "absolute", left: 0, bottom: 32 },
  footer: { height: FOOTER_HEIGHT },
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
        marginHorizontal: 32,
        height: ADD_IDEA_HEIGHT,
      }}
    >
      <TextInput
        multiline
        numberOfLines={3}
        maxLength={200}
        style={{
          flex: 1,
          borderWidth: 5,
          borderColor: "white",
          paddingHorizontal: 16,
          borderTopLeftRadius: 30,
          borderBottomRightRadius: 30,
          fontFamily: "IRANYekanRDMobile",
          fontSize: 18,
          color: "white",
          textAlign: "right",
          elevation: 4,
        }}
        returnKeyType="done"
        onChangeText={(text) => setIdea(text)}
        placeholder={t("happiness.exercise.ideaPlaceholder")}
        placeholderTextColor="white"
        value={idea}
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          Keyboard.dismiss();
          onPress(idea);
          setIdea("");
        }}
        style={{ position: "absolute", right: 11, top: 11 }}
      >
        <IconSvg
          name="tickFill"
          size="tiny"
          color={disabled ? colors.primaryThird : colors.backgroundPrimaryThird}
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
                  <FormattedText
                    key={idea}
                    style={{ color: "white", fontSize: 22 }}
                  >
                    {idea}
                  </FormattedText>
                ))}
            </ScrollView>
            <View style={ideasStyles.footer}>
              <View style={ideasStyles.closeButton}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <GaussIcon
                    backgroundColor={"white"}
                    color={colors.backgroundPrimaryThird}
                    onPress={() => setModalVisible(false)}
                    icon="tickOutline"
                  />
                </TouchableOpacity>
              </View>
              <View style={ideasStyles.imageContainer}>
                <IconSvg
                  name={`happinessToolbox-${categoryID}` as IconSvgName}
                  size={70}
                  color={colors[4]}
                />
              </View>
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
          size={90}
          color={colors.backgroundPrimaryThird}
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
    backgroundColor: colors.backgroundPrimaryThird,
    paddingVertical: 16,
    alignItems: "center",
  },
  text: { fontSize: 24, color: "white" },
  list: {
    alignSelf: "flex-start",
    marginVertical: 24,
    maxHeight: fullWidth,
    width: "100%",
    paddingHorizontal: 32,
  },
  footer: { height: 100, width: "100%" },
  imageContainer: {
    position: "absolute",
    right: 10,
    bottom: 0,
    width: 70,
    height: 70,
    // borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderRadius: 70,
  },
  closeButton: {
    position: "absolute",
    left: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginTop: 6,
    zIndex: 1,
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 24,
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
  const image2: IconSvgName = isAllDone()
    ? "rewardCertificate"
    : isCategoryDone()
    ? "rewardMedal"
    : "rewardDaily";
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
        <TouchableOpacity onPress={() => handleAfterDone()}>
          <View style={feedbackStyles.container}>
            <View style={feedbackStyles.imageContainer}>
              <Gif image={image} theme="purple" />
            </View>
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
            >
              <IconSvg name={image2} size={55} color={colors[10]} />
            </View>
            <View style={feedbackStyles.textContainer}>
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
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const feedbackStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  container: {
    width: fullWidth - 2 * 36,
    height: fullWidth - 2 * 36,
    borderRadius: fullWidth - 2 * 36,
    borderWidth: 5,
    borderColor: colors.backgroundPrimary,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundPrimaryThird,
    // borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
  },
  textContainer: {
    flexDirection: "column",
    top: -10,
    width: fullWidth - 36 * 2 - 130,
  },
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.8,
    color: "white",
    textAlign: "center",
    // borderWidth: 2,
    // borderColor: "green",
  },
  imageContainer: {
    top: -10,
  },
});

type HeaderProps = { title: string };
function Header({ title }: HeaderProps) {
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
