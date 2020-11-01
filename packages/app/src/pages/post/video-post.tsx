import React from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";
import * as Types from "types";
import { resolveURL } from "utils/resolve";

type Props = {
  post: Types.IPost;
};

const VideoPost = ({ post }: Props) => {
  const video = post.videos[0];
  const uri = resolveURL(video.url);

  return (
    <View style={styles.modalContainer}>
      <Video
        source={{ uri }}
        style={styles.backgroundVideo}
        // paused={pause}
        // onLoad={() => {}}
        // onError={() => {}}
        resizeMode="contain"
        // minLoadRetryCount={4}
        controls={true}
        poster={video.cover ? resolveURL(video.cover) : undefined}
        // posterResizeMode="cover"
        hideShutterView={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "black",
    paddingHorizontal: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    borderRadius: 13,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPost;
