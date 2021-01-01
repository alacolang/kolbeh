import colors from "colors";
import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { IconSvg, IconSvgName, Icon } from "components/icon";
import { play } from "./sound";
import rewardDailyImg from "../../assets/images/reward-daily.gif";
import rewardMedalImg from "../../assets/images/connection.gif";
import rewardCertificateImg from "../../assets/images/reward-certificate.gif";
import RadialGradientBackground from "./radial-gradient-background";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;
const bigStarSize = Math.floor(fullWidth * 0.9);
const smallStarSize = Math.floor(fullWidth * 0.1);
const gifSize = Math.floor(fullWidth * 0.35);

const rewardSize = 100;

type FeedbackProps = {
  modalVisible: boolean;
  handleAfterDone: () => void;
  isCategoryDone: () => boolean;
  isAllDone: () => boolean;
};

export function Feedback({
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

  const image = isAllDone()
    ? rewardCertificateImg
    : isCategoryDone()
    ? rewardMedalImg
    : rewardDailyImg;
  const image2: IconSvgName | undefined = isAllDone()
    ? "rewardCertificate"
    : isCategoryDone()
    ? "rewardMedal"
    : undefined;
  const rewardColor: string = isAllDone()
    ? colors[10]
    : isCategoryDone()
    ? colors.redPurple
    : "";
  const rewardOffsetTop = isAllDone()
    ? Math.floor(bigStarSize / 2)
    : Math.floor(bigStarSize / 2 - rewardSize / 4);

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
        <RadialGradientBackground
          height={fullHeight}
          width={fullWidth}
          stopColorInside={"#9CB2FF"}
          stopColorOutside={colors.backgroundLight}
          style={feedbackStyles.background}
        />
        <Icon
          size={smallStarSize}
          name={"starWithShadow"}
          style={feedbackStyles.smallStarCenter}
        />
        <Icon
          size={smallStarSize}
          name={"starWithShadow"}
          style={feedbackStyles.smallStarLeft}
        />
        <Icon
          size={smallStarSize}
          name={"starWithShadow"}
          style={feedbackStyles.smallStarRight}
        />
        <View style={feedbackStyles.touchable}>
          <TouchableOpacity onPress={() => handleAfterDone()}>
            <View style={feedbackStyles.container}>
              <Icon
                size={bigStarSize}
                name={"starWithShadow"}
                style={feedbackStyles.bigStar}
              />
              <Image
                source={image}
                style={feedbackStyles.gif}
                resizeMode="contain"
              />
              {image2 ? (
                <IconSvg
                  name={image2}
                  size={rewardSize}
                  color={rewardColor}
                  style={{
                    ...feedbackStyles.reward,
                    top: rewardOffsetTop,
                  }}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const feedbackStyles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  touchable: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bigStar: {
    flex: 1,
    width: bigStarSize,
    height: bigStarSize,
    minHeight: fullWidth / 2,
  },
  gif: {
    position: "absolute",
    flex: 1,
    width: gifSize,
    height: gifSize,
  },
  reward: {
    flex: 1,
    position: "absolute",
    height: rewardSize,
    width: rewardSize,
  },
  smallStarCenter: {
    flex: 1,
    position: "absolute",
    top: bigStarSize / 4,
    left: fullWidth / 2 - smallStarSize / 2,
    width: smallStarSize,
    height: smallStarSize,
  },
  smallStarLeft: {
    flex: 1,
    position: "absolute",
    top: bigStarSize / 2,
    left: bigStarSize / 5,
    width: smallStarSize,
    height: smallStarSize,
  },
  smallStarRight: {
    flex: 1,
    position: "absolute",
    top: bigStarSize / 2,
    right: bigStarSize / 5,
    width: smallStarSize,
    height: smallStarSize,
  },
});
