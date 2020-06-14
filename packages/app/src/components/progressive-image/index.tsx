import React from "react";
import { View, Dimensions, Image, Animated, StyleSheet } from "react-native";

type Props = {
  uri: string;
};

const frameWidth = Dimensions.get("window").width - 40 * 2;
type ISize = { width?: number; height: number };

const ProgressiveImage = ({ uri }: Props) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [, setSize] = React.useState<ISize>({
    width: frameWidth,
    height: frameWidth,
  });

  const thumbUri = uri.replace(".webp", "-150.webp");

  React.useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        setSize({ height: (frameWidth / width) * height });
      },
      () => {}
    );
  }, [uri]);

  const handleLoadImage = () => {
    const animation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });
    animation.start(() => {});
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: thumbUri }}
        style={[styles.image, { opacity: 1 }]}
        resizeMode="cover"
        blurRadius={0.1}
      />
      <Animated.Image
        source={{ uri: uri }}
        onLoad={() => {
          handleLoadImage();
        }}
        style={[styles.image, { opacity: animatedValue }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: frameWidth,
    borderRadius: 13,
    height: frameWidth,
  },
  image: {
    position: "absolute",
    top: 0,
    borderRadius: 13,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
export default ProgressiveImage;
