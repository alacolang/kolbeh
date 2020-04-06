import React from "react";
import { Dimensions, Animated, StyleSheet } from "react-native";
import cloudImg from "../../assets/images/cloud.png";
const width = Dimensions.get("window").width;

const Cloud = () => {
  const y = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const animate = Animated.loop(
      Animated.timing(y, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    animate.start();
  }, []);

  return (
    <>
      <Animated.Image
        source={cloudImg}
        style={[
          styles.cloud1,
          {
            transform: [
              {
                translateX: y.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 20, 0],
                }),
              },
            ],
          },
        ]}
        resizeMode="stretch"
      />
      <Animated.Image
        source={cloudImg}
        style={[
          styles.cloud2,
          {
            transform: [
              {
                translateX: y.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 5, 0],
                }),
              },
            ],
          },
        ]}
        resizeMode="stretch"
      />
    </>
  );
};

const styles = StyleSheet.create({
  cloud1: {
    position: "absolute",
    left: 30,
    top: width / 2.5 / 2,
    width: 120,
    height: 40,
  },
  cloud2: {
    position: "absolute",
    right: 30,
    top: width / 2.5 / 2 + 30,
    width: 90,
    height: 30,
  },
});

export default Cloud;
