import colors from "colors";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
} from "react-native";
import { IconSvg } from "components/icon";
import { TextInput } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

const PADDING_FOR_FULLSCREEN_TEXTINPUT_WITHKEYBOARD = 120;

type AddIdeaInputProps = {
  fullWindowHeight: number;
  addIdeaHeightWithoutKeyBoard: number;
  onPress: (text: string) => void;
  setHideFooterAndDescription: (hide: boolean) => void;
};

export function AddIdeaInput({
  fullWindowHeight,
  addIdeaHeightWithoutKeyBoard,
  onPress,
  setHideFooterAndDescription,
}: AddIdeaInputProps) {
  const { t } = useTranslation();
  const [idea, setIdea] = useState("");
  const [addIdeaInputHeight, setIdeaInputHeight] = useState(
    addIdeaHeightWithoutKeyBoard
  );

  const disabled = idea.length < 2;

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
    };
  });

  const keyboardDidShow = (e: KeyboardEvent): void => {
    setIdeaInputHeight(
      Math.floor(
        fullWindowHeight -
          e.endCoordinates.height -
          PADDING_FOR_FULLSCREEN_TEXTINPUT_WITHKEYBOARD
      )
    );
    setHideFooterAndDescription(true);
  };

  const keyboardDidHide = (): void => {
    setIdeaInputHeight(addIdeaHeightWithoutKeyBoard);
    setHideFooterAndDescription(false);
  };

  return (
    <View
      style={{ ...AddIdeaInputStyles.container, height: addIdeaInputHeight }}
    >
      <TextInput
        multiline
        numberOfLines={3}
        maxLength={200}
        style={AddIdeaInputStyles.input}
        returnKeyType="done"
        onChangeText={(text) => setIdea(text)}
        placeholder={t("happiness.exercise.ideaPlaceholder")}
        placeholderTextColor="white"
        value={idea}
        textAlignVertical="top"
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          Keyboard.dismiss();
          onPress(idea);
          setIdea("");
        }}
        style={AddIdeaInputStyles.iconContainer}
      >
        <IconSvg
          name="tickFill"
          size={24}
          color={disabled ? colors.primaryThird : colors.backgroundPrimaryThird}
          style={AddIdeaInputStyles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const AddIdeaInputStyles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flexDirection: "row",
    marginHorizontal: 32,
  },
  input: {
    flex: 1,
    borderWidth: 5,
    borderColor: "white",
    paddingRight: 32,
    paddingLeft: 16,
    paddingTop: 24,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    fontFamily: "IRANYekanRDMobile",
    fontSize: 18,
    color: "white",
    textAlign: "right",
    elevation: 4,
  },
  iconContainer: { position: "absolute", right: 15, top: 15 },
  icon: {
    elevation: 8,
    borderRadius: 24,
    backgroundColor: colors.backgroundPrimary,
  },
});
