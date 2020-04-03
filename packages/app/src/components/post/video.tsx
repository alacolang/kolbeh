import React from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import Video from "react-native-video";
import colors from "../../colors";
import config from "../../config";
import * as Types from "../../types";

const frameWidth = Dimensions.get("window").width - 30 * 2;

type Props = { videos: Types.IVideo[] };

const TheVideo = ({ videos }: Props) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const video = videos[0];
  const uri = config.HOST + video.url;

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
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <Video
            source={{ uri }}
            style={styles.backgroundVideo}
            // paused={pause}
            onLoad={(d) => {
              // console.log("loaded", video, d);
            }}
            onError={(e) => {
              // console.log("error", e, video);
            }}
            resizeMode="contain"
            // minLoadRetryCount={4}
            controls={true}
            // poster={video.cover ? config.HOST + video.cover : undefined}
            // posterResizeMode="cover"
            hideShutterView={true}
          />
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.backgroundVideo}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Image
          source={{ uri: config.HOST + video.cover }}
          style={styles.backgroundVideo}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    height: frameWidth,
    width: frameWidth,
  },
  backgroundVideo: {
    backgroundColor: colors.background,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default TheVideo;
