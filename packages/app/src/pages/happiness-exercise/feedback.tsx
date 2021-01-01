import colors from "colors";
import React, { useEffect, useRef } from "react";
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
import Animated, { Easing } from "react-native-reanimated";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;
const bigStarSize = Math.floor(fullWidth * 0.9);
const smallStarSize = Math.floor(fullWidth * 0.1);
const gifSize = Math.floor(fullWidth * 0.4);

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

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    if (modalVisible && sound) {
      play(sound, { stopAndPlay: true });
    }
  }, [sound, modalVisible]);

  const image = isAllDone()
    ? rewardCertificateImg
    : isCategoryDone()
    ? rewardMedalImg
    : rewardDailyImg;
  const rewardIconName: IconSvgName | undefined = isAllDone()
    ? "rewardCertificate"
    : isCategoryDone()
    ? "rewardMedal"
    : undefined;
  const rewardColor: string = isAllDone()
    ? colors[10]
    : isCategoryDone()
    ? colors.redPurple
    : "";
  const rewardOffsetTop = isAllDone() ? 0 : -rewardSize / 3;

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
          stopColorInside={"#AF99F1"}
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
              {rewardIconName ? (
                <Animated.View
                  style={{
                    ...feedbackStyles.reward,
                    top: rewardOffsetTop,
                    opacity,
                  }}
                >
                  <IconSvg
                    name={rewardIconName}
                    size={rewardSize}
                    color={rewardColor}
                  />
                </Animated.View>
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
    justifyContent: "center",
    alignItems: "center",
    width: bigStarSize,
    height: bigStarSize,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bigStar: {
    width: bigStarSize,
    height: bigStarSize,
  },
  gif: {
    position: "absolute",
    top: (bigStarSize - gifSize) / 2 + 20,
    width: gifSize,
    height: gifSize,
  },
  reward: {
    position: "absolute",
    height: rewardSize,
    width: rewardSize,
  },
  smallStarCenter: {
    position: "absolute",
    top: bigStarSize / 4,
    left: fullWidth / 2 - smallStarSize / 2,
    width: smallStarSize,
    height: smallStarSize,
  },
  smallStarLeft: {
    position: "absolute",
    top: bigStarSize / 2,
    left: bigStarSize / 5,
    width: smallStarSize,
    height: smallStarSize,
  },
  smallStarRight: {
    position: "absolute",
    top: bigStarSize / 2,
    right: bigStarSize / 5,
    width: smallStarSize,
    height: smallStarSize,
  },
});
