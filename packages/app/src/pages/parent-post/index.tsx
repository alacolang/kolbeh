import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { useRoute, RouteProp } from "@react-navigation/core";

import colors from "../../colors";
import TheVideo from "./video";
import TheImage from "./image";

type ParentFeedNavigationProp = RouteProp<ParentStackParamList, "parentPost">;

const frameWidth = Dimensions.get("window").width - 30 * 2;

const Post = () => {
  const route = useRoute<ParentFeedNavigationProp>();
  const post = route.params;

  const stuff = [
    ...post.videos.map((video) => ({ ...video, type: "video" })),
    ...post.images.map((image) => ({ ...image, type: "image" })),
  ];

  const renderItem = ({ item }) => {
    const content =
      item.type === "image" ? (
        <TheImage image={item} />
      ) : (
        <TheVideo video={item} />
      );

    return (
      <View style={styles.container}>
        <View style={styles.outerCircle}></View>
        <View style={styles.circle}></View>
        {content}
        <View style={styles.footer}></View>
      </View>
    );
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
  container: {
    marginVertical: 15,
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
