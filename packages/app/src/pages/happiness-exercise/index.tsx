import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Markdown from "react-native-easy-markdown";
import colors from "colors";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useHappiness } from "context/happiness";
import { load, SOUND_NAMES, play, release } from "./sound";
import { trackEvent } from "utils/analytics";
import config from "config";
import { Header } from "./header";
import { AddIdeaInput } from "./add-idea-input";
import { CloseButton } from "./close-button";
import { Feedback } from "./feedback";
import { Ideas } from "./ideas";

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
  const [hideFooterAndDescription, setHideFooterAndDescription] = useState(
    false
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
        {hideFooterAndDescription ? null : (
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            style={{
              height:
                fullHeight -
                FOOTER_HEIGHT -
                (isAlreadyDone ? 0 : ADD_IDEA_HEIGHT),
            }}
          >
            <Header title={exercise.title} />
            <Markdown markdownStyles={markdownStyles}>
              {exercise.description}
            </Markdown>
            <View style={{ marginTop: 16 }} />
          </ScrollView>
        )}
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
              setHideFooterAndDescription={setHideFooterAndDescription}
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
        {hideFooterAndDescription ? (
          <View style={styles.footer} />
        ) : (
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
        )}
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
