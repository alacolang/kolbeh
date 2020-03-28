import React from "react";
import { StyleSheet, View } from "react-native";
import config from "../../config";

// Within your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if you like.

const Child = () => {
  // let ref = React.useRef();
  return (
    <View style={styles.container}></View>

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

});

export default Child;