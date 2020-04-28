import React from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import icons from "../icon/images";

type Props = { varient?: boolean };

const Loading = ({ varient = false }: Props) => {
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
      <Animated.Image
        source={varient ? icons.loadingVarient : icons.loading}
        style={[
          styles.size,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />
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
    width: 40,
    height: 40,
  },
});

export default Loading;
