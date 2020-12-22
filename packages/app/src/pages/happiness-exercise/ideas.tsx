import colors from "colors";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { IconSvg, IconSvgName } from "../../components/icon";
import { FormattedText } from "../../components/formatted-text";
import { ScrollView } from "react-native-gesture-handler";
import { GaussIcon } from "../../components/curve-icon";

const fullWidth = Dimensions.get("window").width;

type IdeasProps = { categoryID: string; title: string; ideas: string[] };

export function Ideas({ title, categoryID, ideas }: IdeasProps) {
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
