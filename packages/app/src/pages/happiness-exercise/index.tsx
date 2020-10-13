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
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSvg } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import rewardDailyImg from "assets/images/reward-daily.png";
import rewardMedalImg from "assets/images/reward-medal.png";
import { useHappiness } from "context/happiness";
import { GaussIcon } from "components/curve-icon";
import { Trans, useTranslation } from "react-i18next";

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
        <Header title={exercise.title} />
        <Markdown markdownStyles={markdownStyles}>
          {exercise.description}
        </Markdown>
      </View>
      {isAlreadyDone ? null : (
        <AddIdea
          title={category.title}
          handleDone={(idea: string) => {
            happiness.addIdea(category.id, idea);
            happiness.markExerciseAsDone(exercise.id);
          }}
          isCategoryDone={() => happiness.isCategoryDone(category)}
          handleAfterDone={() => {
            navigation.navigate("home");
          }}
        />
      )}
      <Ideas
        ideas={happiness.ideas[category.id] ?? []}
        title={exercise.title}
        categoryID={category.id}
      />
      <View style={styles.close}>
        <CloseButton onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderWidth: 0, paddingHorizontal: 30 },
  close: { position: "absolute", left: 0, bottom: 40 },
});

type AddIdeaInputProps = { onPress: (text: string) => void };
const AddIdeaInput = ({ onPress }: AddIdeaInputProps) => {
  const { t } = useTranslation();
  const [idea, setIdea] = useState("");
  return (
    <View
      style={{
        alignSelf: "center",
        flexDirection: "row",
        width: "80%",
        // marginBottom: 16,
        borderWidth: 0,
      }}
    >
      <TextInput
        style={{
          height: 40,
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 16,
          borderRadius: 25,
          fontFamily: "IRANYekanRDMobile",
          textAlign: "right",
        }}
        onChangeText={(text) => setIdea(text)}
        placeholder={t("happiness.exercise.ideaPlaceholder")}
        value={idea}
      />
      <TouchableOpacity
        onPress={() => {
          onPress(idea);
          setIdea("");
          Keyboard.dismiss();
        }}
        style={{ position: "absolute", right: 10, top: 7.5, borderWidth: 0 }}
      >
        <IconSvg name="tickFill" size="tiny" color={colors.primaryThird} />
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
        <View style={ideaStyles.modal}>
          <View style={ideaStyles.container}>
            <FormattedText style={ideaStyles.text}>
              {title + " "}‍
            </FormattedText>
            <ScrollView style={ideaStyles.list}>
              {ideas.map((idea) => (
                <FormattedText key={idea} style={{ fontSize: 20 }}>
                  {idea}
                </FormattedText>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSvg name="tickOutline" size="small" color="#00DE76" />
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
          size={80}
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
    marginTop: 24,
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

type AddIdeaProps = {
  title: string;
  handleDone: (idea: string) => void;
  handleAfterDone: () => void;
  isCategoryDone: () => boolean;
};
function AddIdea({
  title,
  handleDone,
  handleAfterDone,
  isCategoryDone,
}: AddIdeaProps) {
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
        <View style={addIdeaStyles.modal}>
          <View style={addIdeaStyles.container}>
            <View style={addIdeaStyles.innerContainer}>
              <FormattedText style={addIdeaStyles.text}>
                <Trans
                  i18nKey={
                    isCategoryDone()
                      ? "happiness.reward.category"
                      : "happiness.reward.exercise"
                  }
                  values={{ title }}
                  components={[<FormattedText style={addIdeaStyles.text} />]}
                />
              </FormattedText>

              <View style={addIdeaStyles.imageContainer}>
                <Image
                  source={isCategoryDone() ? rewardMedalImg : rewardDailyImg}
                  style={addIdeaStyles.image}
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
      <AddIdeaInput
        onPress={(text: string) => {
          // if (text.trim() === "") return;
          handleDone(text);
          setModalVisible(true);
        }}
      />
    </>
  );
}
const addIdeaStyles = StyleSheet.create({
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
  text: {
    // paddingLeft: 16,
    paddingTop: 36,
    paddingRight: 36,
    fontSize: 18,
    lineHeight: 18 * 1.8,
    color: colors.primary,
    width: fullWidth - 36 * 2 - 130,
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
