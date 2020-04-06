import React from "react";
import { View, StyleSheet } from "react-native";
import TheVideo from "./video";
import TheImage from "./image";
import * as Types from "../../types";
import colors from "../../colors";
import Dot from "../post-dot";
import Markdown from "./markdown";

type Props = {
  post: Types.IPostEdge;
  // navigate: Function;
};

const Post = ({
  post,
}: // navigate
Props) => {
  let content;
  const node = post.node;
  if (node.images && node.images.length > 0) {
    content = <TheImage images={node.images} />;
  } else if (node.videos && node.videos.length > 0) {
    content = <TheVideo videos={node.videos} />;
  } else {
    content = (
      <Markdown
        post={post.node}
        // navigate={navigate}
      />
    );
    // content = null
  }

  return (
    <View style={styles.container}>
      <Dot />
      {content}
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    borderRadius: 10,
    padding: 13,
    backgroundColor: "white",
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
});

export default Post;
