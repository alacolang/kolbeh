import colors from "colors";
import { IconSvg } from "components/icon";
import React from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

type Props = { color?: string };

const size = 32;

const Loading = ({ color = colors.primary }: Props) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.size,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <IconSvg name="loading" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  size: {
    width: size,
    height: size,
  },
});

export default Loading;
