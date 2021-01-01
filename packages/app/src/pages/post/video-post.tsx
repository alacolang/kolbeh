import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Video from "react-native-video";
import * as Types from "types";
import { resolveURL } from "utils/resolve";
import Loading from "../../components/loading/index";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

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
          <Loading color={"black"} />
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
    flex: 1,
    position: "absolute",
    width: fullWidth,
    height: fullHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    opacity: 0.5,
  },
});

export default VideoPost;
