import React from "react";
import { StyleSheet, View } from "react-native";
import Video from "react-native-video";
import config from "../../config";

// Within your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if you like.

const Kid = () => {
  // let ref = React.useRef();
  return (
    <View style={styles.container}>
    <Video
      source={{ uri: config.HOST + "/static/images/grief.mp4" }} // Can be a URL or a local file.
      // ref={(ref) => {
      //   this.player = ref;
      // }} // Store reference
      // onBuffer={this.onBuffer} // Callback when remote video is buffering
      // onError={this.videoError} // Callback when video cannot be loaded
      style={styles.backgroundVideo}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 100,
    // width: 100,
    // backgroundColor: 'red',
    // borderWidth: 1
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Kid;