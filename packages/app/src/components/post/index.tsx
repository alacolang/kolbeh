import React from "react";
import { View, StyleSheet } from "react-native";
import Analytics from "appcenter-analytics";
import TheVideo from "./video";
import TheImage from "./image";
import * as Types from "../../types";
import colors from "../../colors";
import Dot from "../post-dot";
import Markdown from "./markdown";

type Props = {
  post: Types.IPostEdge;
};

const Post = ({ post }: Props) => {
  let content;
  const node = post.node;
  let postType : 'markdown' | 'image' | 'video';
  const track = () => {
    Analytics.trackEvent("Post clicked", {
      category: post.node.category,
      type: postType,
      id: post.node.id,
    });
  };

  if (node.markdown && node.markdown.content) {
    postType = "markdown";
    content = <Markdown post={post.node} track={track} />;
  } else if (node.images && node.images.length > 0) {
    postType = "image";
    content = <TheImage images={node.images} track={track} />;
  } else if (node.videos && node.videos.length > 0) {
    postType = "video";
    content = <TheVideo videos={node.videos} track={track} />;
  } else {
    content = null;
  }

  return (
    <View style={styles.container}>
      <Dot />
      {content}
      <View style={styles.footer} />
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
