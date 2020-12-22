import colors from "colors";
import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { IconSvg, IconSvgName } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { Trans } from "react-i18next";
import { play } from "./sound";
import rewardDailyImg from "../../assets/images/reward-daily.gif";
import rewardMedalImg from "../../assets/images/connection.gif";
import rewardCertificateImg from "../../assets/images/reward-certificate.gif";
import { CircularGif } from "./circular-gif";

const fullWidth = Dimensions.get("window").width;

type FeedbackProps = {
  modalVisible: boolean;
  title: string;
  handleAfterDone: () => void;
  isCategoryDone: () => boolean;
  isAllDone: () => boolean;
};

export function Feedback({
  title,
  modalVisible,
  handleAfterDone,
  isCategoryDone,
  isAllDone,
}: FeedbackProps) {
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
              <CircularGif image={image} ringColor={colors.backgroundPrimary} />
            </View>
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: -20,
              }}
            >
              <IconSvg
                name={image2}
                size={65}
                color={colors.backgroundSecondary}
              />
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
}

const feedbackStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  },
  container: {
    width: fullWidth - 2 * 36,
    height: fullWidth - 2 * 36,
    borderRadius: fullWidth - 2 * 36,
    borderWidth: 7,
    borderColor: colors.backgroundPrimary,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundPrimaryThird,
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
  },
  textContainer: {
    flexDirection: "column",
    top: -10,
    width: fullWidth - 36 * 2 - 130,
  },
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.6,
    color: "white",
    textAlign: "center",
  },
  imageContainer: {
    top: -10,
  },
});
