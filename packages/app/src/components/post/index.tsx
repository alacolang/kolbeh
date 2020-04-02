import React from "react";
import { View, StyleSheet, StatusBar, FlatList } from "react-native";
import TheVideo from "./video";
import TheImage from "./image";
import * as Types from "../../types";
import colors from "../../colors";

type Props = {
  post: Types.IPostEdge;
};

const Post = ({ post }: Props) => {
  let content;
  const node = post.node;
  if (node.images && node.images.length > 0) {
    content = <TheImage images={node.images} />;
  } else {
    content = <TheVideo videos={node.videos} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}></View>
      <View style={styles.circle}></View>
      {content}
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
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
