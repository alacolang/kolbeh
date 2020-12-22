import { imageSize } from "pages/happiness-training/constants";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

type Props = { image: ImageSourcePropType; ringColor: string };

export const CircularGif = ({ image, ringColor }: Props) => {
  return (
    <View
      style={[circularGifStyles.imageContainer, { borderColor: ringColor }]}
    >
      <Image
        source={image}
        style={circularGifStyles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const circularGifStyles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: imageSize,
    width: imageSize,
    height: imageSize,
    borderWidth: 7,
  },

  image: {
    height: imageSize * 0.6,
    width: imageSize * 0.6,
  },
});
