import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Header from "../settings/header";
import { Trans } from "react-i18next";
import rewardCertificateImg from "../../assets/images/reward-certificate.gif";
import Gif from "pages/happiness-training/Gif";
import { imageSize } from "pages/happiness-training/Slide";

const fullWidth = Dimensions.get("window").width - 16 * 2;
const size = (fullWidth - 20) / 3 - 4 * 2;

function Profile() {
  const happiness = useHappiness();

  const ys = [22, 8, 2, 7, 22];
  const xs = [1, 4, 0, -6, -3];
  const categories = happiness.rawCategories.map((category) => {
    const exercises = category.exercises.map((exercise, index) => {
      const isDone = happiness.exercises[exercise.id].state === "done";
      return (
        <View
          key={exercise.id}
          style={{
            // paddingHorizontal: 2,
            position: "relative",
            top: -ys[index],
            right: xs[index],
          }}
        >
          <IconSvg
            name="star"
            size={(size - 2 * 2) / 7 - 2 * 2 - 1}
            color={isDone ? colors[10] : "lightgrey"}
          />
        </View>
      );
    });

    return (
      <View
        key={category.id}
        style={{
          marginHorizontal: 3,
          width: size,
          height: size - 10,
          alignItems: "center",
          paddingTop: 18,
        }}
      >
        <Icon
          name="medal"
          size={0}
          style={{
            position: "absolute",
            width: size - 20,
            height: size - 20,
          }}
        />
        <IconSvg
          name={`happinessToolbox-${category.id}`}
          size={size / 3.2}
          color={colors[10]}
        />
        <View style={{ flexDirection: "row" }}>{exercises}</View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header showMedal showName />
      <View
        style={{
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {categories}
          {happiness.isAllDone() || true ? (
            <>
              <View style={{ flex: 1 }} />
              <View
                style={{
                  marginHorizontal: 3,
                  width: size,
                  height: size,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Certificate />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
});

const Certificate = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const image = rewardCertificateImg;
  return (
    <>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={feedbackStyles.modal}>
          <View style={feedbackStyles.container}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignItems: "center" }}
            >
              <View style={feedbackStyles.imageContainer}>
                <Gif image={image} theme="purple" />
                <View
                  style={{
                    position: "absolute",
                    top: imageSize / 10,
                    left: imageSize / 8,
                  }}
                >
                  <IconSvg
                    name="rewardCertificate"
                    size={55}
                    color={colors.backgroundPrimary}
                  />
                </View>
              </View>
              <View style={feedbackStyles.textContainer}>
                <FormattedText style={feedbackStyles.text}>
                  <Trans
                    i18nKey={"happiness.reward.allDone"}
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
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <IconSvg name="rewardCertificate" size={80} color={colors[10]} />
      </TouchableOpacity>
    </>
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
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
  },
  textContainer: {
    top: -5,
    width: fullWidth - 36 * 2 - 130,
  },
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.6,
    color: "white",
    textAlign: "center",
  },
  imageContainer: {
    // position: "absolute",
    // right: -20,
    // top: 0,
  },
});

export default Profile;
