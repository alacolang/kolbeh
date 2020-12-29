import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";
import * as Types from "types";
import { resolveURL } from "utils/resolve";
import Loading from "../../components/loading/index";
import Color from "../../colors";

type Props = {
  post: Types.IPost;
};

const bufferConfig = {
  minBufferMs: 5000, //default is 15000
  maxBufferMs: 50000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
};
const minLoadRetryCount = 5;

const VideoPost = ({ post }: Props) => {
  const video = post.videos[0];
  const uri = resolveURL(video.url);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);

  return (
    <View style={styles.modalContainer}>
      <Video
        source={{ uri }}
        style={styles.backgroundVideo}
        // paused={pause}
        onLoad={() => {
          setVideoIsLoaded(true);
        }}
        // onError={() => {}}
        bufferConfig={bufferConfig}
        minLoadRetryCount={minLoadRetryCount}
        resizeMode="contain"
        controls={true}
        poster={video.cover ? resolveURL(video.cover) : undefined}
        // posterResizeMode="cover"
        hideShutterView={true}
      />
      {videoIsLoaded ? null : (
        <View style={styles.loadingIcon}>
          <Loading color={Color.primary} />
        </View>
      )}
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
  loadingIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoPost;
