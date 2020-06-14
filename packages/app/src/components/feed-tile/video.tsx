import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "../icon";
import * as Types from "types";
import { resolveURL } from "utils/resolve";
import ProgressiveImage from "components/progressive-image";

type Props = {
  post: Types.IPost;
};

const TheVideo = ({ post }: Props) => {
  const video = post.videos[0];

  const uri = resolveURL(video.cover);

  return (
    <>
      <ProgressiveImage uri={uri} />
      <View style={styles.iconContainer}>
        <Icon name="video" size="small" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
