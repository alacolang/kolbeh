import React from "react";
import {
  Dimensions,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Image,
} from "react-native";
import Video from "react-native-video";
import colors from "../../colors";
import config from "../../config";
import icons, { Icon } from "../icon";
import * as Types from "../../types";
import { resolveURL } from "../../utils/resolve";

const frameWidth = Dimensions.get("window").width - 30 * 2;

type Props = { videos: Types.IVideo[]; track: () => void };

const TheVideo = ({ videos, track }: Props) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const video = videos[0];
  const uri = resolveURL(video.url);

  return (
    <View style={styles.videoContainer}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        // statusBarTranslucent={true}
        // presentationStyle="overFullScreen"
      >
        <StatusBar
          // backgroundColor={colors.background}
          backgroundColor="black"
          // barStyle="light-content"
          // translucent={true}
        />
        <View style={styles.modalContainer}>
          <Video
            source={{ uri }}
            style={styles.backgroundVideo}
            // paused={pause}
            onLoad={() => {
              // console.log("loaded", video, d);
            }}
            onError={() => {
              // console.log("error", e, video);
            }}
            resizeMode="contain"
            // minLoadRetryCount={4}
            controls={true}
            poster={video.cover ? resolveURL(video.cover) : undefined}
            // posterResizeMode="cover"
            hideShutterView={true}
          />
        </View>
        <TouchableHighlight
          style={styles.backContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image source={icons.back} resizeMode="contain" style={styles.back} />
        </TouchableHighlight>
      </Modal>
      <TouchableOpacity
        style={styles.backgroundVideo}
        onPress={() => {
          track();
          setModalVisible(true);
        }}
      >
        <Image
          source={{ uri: resolveURL(video.cover) }}
          style={styles.backgroundVideo}
          resizeMode="cover"
        />
        <View style={styles.iconContainer}>
          <Icon name="play" size="small" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // backgroundColor: colors.background,
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    height: frameWidth,
    width: frameWidth,
  },
  backgroundVideo: {
    // backgroundColor: colors.background,
    position: "absolute",
    top: 0,
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
  backContainer: {
    position: "absolute",
    top: 4,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    width: 24,
    height: 24,
  },
});

export default TheVideo;
