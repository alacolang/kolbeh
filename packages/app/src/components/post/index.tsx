import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Analytics from "appcenter-analytics";
import TheVideo from "./video";
import TheImage from "./image";
import * as Types from "../../types";
import colors from "../../colors";
import Dot from "../post-dot";
import Markdown from "./markdown";
import { Icon } from "../../components/icon";

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

  const [saved, setSaved] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.saveContainer}
        onPress={() => {
          setSaved(!saved);
        }}
      >
        <View style={styles.save}>
          <Icon
            name={saved ? "saveActive" : "save"}
            size={30}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity> */}
      <Dot />
      {content}
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
  saveContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 1000,
    width: 50,
    height: 50,
    borderWidth: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  save: {
    backgroundColor: "white",
    padding: 3,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default Post;
