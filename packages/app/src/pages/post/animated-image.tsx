import React from "react";
import { Image, Dimensions, View, Animated } from "react-native";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";

const frameWidth = Dimensions.get("window").width - 30 * 2;
const frameHeight = Dimensions.get("window").height;

type ILovelyImage = {
  scrollAnimatedValue: any;
  alt: string;
  title: string;
  uri: string;
};
const LovelyImage = ({
  scrollAnimatedValue,
  title,
  uri,
  alt,
}: ILovelyImage) => {
  const ref = React.useRef<any>();

  const noAnimate = alt === "no-animate";
  const [yLocal, setYLocal] = React.useState<number>(0);

  return (
    <View
      onLayout={(event) => {
        // has to be, even it's empty
      }}
      ref={ref}
    >
      <Animated.View
        style={{
          height: (frameHeight / 4) * 2.5,
          // borderWidth: 4,
          // borderColor: "blue",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          transform: [
            {
              translateY: noAnimate
                ? 0
                : scrollAnimatedValue.interpolate({
                    inputRange: [
                      yLocal,
                      yLocal + 90,
                      // 0,
                      yLocal + frameHeight / 2,
                    ],
                    outputRange: [
                      // 0,
                      0,
                      frameHeight / 4,
                      (1.5 * frameHeight) / 4,
                    ],
                    extrapolate: "clamp",
                  }),
              translateX: noAnimate
                ? 0
                : scrollAnimatedValue.interpolate({
                    inputRange: [yLocal, yLocal + frameWidth / 8],
                    outputRange: [0, (-1.5 * frameWidth) / 4],
                    extrapolate: "clamp",
                  }),
              scale: noAnimate
                ? 0
                : scrollAnimatedValue.interpolate({
                    inputRange: [yLocal, yLocal + frameHeight / 3],
                    outputRange: [1, 0.4],
                    extrapolate: "clamp",
                  }),
            },
          ],
        }}
      >
        <Image
          onLoadEnd={() => {
            ref.current.measure(
              (
                _x: number,
                _y: number,
                _width: number,
                _height: number,
                _pageX: number,
                pageY: number
              ) => {
                // console.log("onLoadEnd", y, imageKey, yLocal, pageY);
                setYLocal(pageY);
              }
            );
          }}
          source={{ uri }}
          style={{
            width: frameWidth,
            height: frameWidth,
            // borderWidth: 1,
            // borderColor: "red",
          }}
          resizeMode="contain"
        />
        <FormattedText
          style={{
            // borderWidth: 1,
            color: colors.secondary,
            textAlign: "center",
          }}
        >
          {title}
        </FormattedText>
      </Animated.View>
    </View>
  );
};

export default LovelyImage;
