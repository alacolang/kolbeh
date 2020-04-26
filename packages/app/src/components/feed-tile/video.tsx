import React from "react";
import { Dimensions, View, StyleSheet, Image } from "react-native";
import icons, { Icon } from "../icon";
import * as Types from "../../types";
import { resolveURL } from "../../utils/resolve";

const frameWidth = Dimensions.get("window").width - 40 * 2;

type Props = {
  post: Types.IPost;
};

const TheVideo = ({ post }: Props) => {
  const video = post.videos[0];

  return (
    <View style={styles.videoContainer}>
      <Image
        source={{ uri: resolveURL(video.cover) }}
        style={styles.backgroundVideo}
        resizeMode="cover"
      />
      <View style={styles.iconContainer}>
        <Icon name="play" size="small" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: frameWidth,
    width: frameWidth,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    borderRadius: 13,
    left: 0,
    bottom: 0,
    right: 0,
  },
  iconContainer: {
    backgroundColor: "transparent",
    borderRadius: 100,
    // borderWidth: 1,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    top: 0,
  },
});

export default TheVideo;
