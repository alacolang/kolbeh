import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import Video from "react-native-video";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { useRoute, RouteProp } from "@react-navigation/core";
import config from "../../config";
import colors from "../../colors";

type ParentFeedNavigationProp = RouteProp<ParentStackParamList, "parentPost">;

const frameWidth = Dimensions.get("window").width - 30 * 2;

const TheVideo = ({ video }: { video: { url: string; cover: string } }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const uri = config.HOST + video.url;

  console.log({
    cover: config.HOST + video.cover,
    uri: uri,
  });

  return (
    <View style={{ flex: 1 }}>
      <Modal
        transparent={false}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modelContainer}>
          <Video
            source={{ uri }}
            style={styles.backgroundVideo}
            // paused={pause}
            onLoad={(d) => {
              console.log("loaded", video, d);
            }}
            onError={(e) => {
              console.log("error", e, video);
            }}
            resizeMode="contain"
            // minLoadRetryCount={4}
            controls={true}
            poster={video.cover ? config.HOST + video.cover : undefined}
            // posterResizeMode="cover"
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

const TheImage = ({ image }: { image: { url: string } }) => {
  const [size, setSize] = React.useState({ width: frameWidth, height: 0 });
  const uri = config.HOST + image.url;
  Image.getSize(
    uri,
    (width, height) => {
      setSize({ height: frameWidth / width * height });
    },
    () => {}
  );
  return (
    <View style={styles.container}>
      <Image
        style={[styles.imageContainer, size]}
        source={{ uri }}
        resizeMode="cover"
      />
    </View>
  );
};

const Post = () => {
  const route = useRoute<ParentFeedNavigationProp>();
  const post = route.params;

  const stuff = [
    ...post.videos.map((video) => ({ ...video, type: "video" })),
    ...post.images.map((image) => ({ ...image, type: "image" })),
  ];

  // console.log(stuff);

  const renderItem = ({ item }) => {
    if (item.type === "image") {
      let image = item;
      return <TheImage image={image} />;
    } else {
      let video = item;
      return (
        <View style={styles.container}>
          <View style={styles.outerCircle}></View>
          <View style={styles.circle}></View>
          <View style={styles.videoContainer}>
            <TheVideo video={video} />
          </View>
          <View style={styles.footer}></View>
        </View>
      );
    }
  };

  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <FlatList
        contentContainerStyle={styles.outerContainer}
        data={stuff}
        renderItem={renderItem}
        // removeClippedSubviews={true}
        // initialNumToRender={1}
        // maxToRenderPerBatch={1}
        // windowSize={1}
        keyExtractor={(item) => item.url}
      />
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  modelContainer: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginVertical: 15,
    // marginHorizontal: 60,
    borderRadius: 10,
    borderWidth: 10,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  videoContainer: {
    height: frameWidth,
    width: frameWidth,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 5,
  },
  imageContainer: {
    // height: (width / 600) * 1600,
    width: frameWidth,
    // borderRadius: 20,
    borderWidth: 5,
    borderColor: "white",
  },
  footer: {
    height: 0,
    backgroundColor: colors.orange,
  },
  outerCircle: {
    position: "absolute",
    left: -10,
    top: -10,
    borderRadius: 30 / 2,
    width: 25 / 2,
    height: 25 / 2,
    backgroundColor: colors.background,
  },
  circle: {
    position: "absolute",
    left: -10,
    top: -10,
    borderRadius: 20 / 2,
    width: 20 / 2,
    height: 20 / 2,
    backgroundColor: colors.orange,
  },
});

export default Post;
