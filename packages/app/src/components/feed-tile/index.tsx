import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import VideoCover from "./video";
import ImageCover from "./image";
import * as Types from "types";
import MarkdownCover from "./markdown";
import { trackEvent } from "utils/analytics";

type FeedNavigation = NavigationProp<ParentStackParamList, "parentFeed">;

type Props = {
  post: Types.IPostEdge;
};

const Post = ({ post }: Props) => {
  const { id, type, category } = post.node;
  const Cover = {
    image: ImageCover,
    inapp: ImageCover,
    video: VideoCover,
    markdown: MarkdownCover,
  }[type];

  const navigation = useNavigation<FeedNavigation>();

  const track = () => {
    trackEvent("post", {
      category,
      type,
      id: id.replace(/\.md$/, ""),
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          track();
          navigation.navigate("post", {
            post: post.node,
            id: post.node.id,
          });
        }}
      >
        <Cover post={post.node} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    borderRadius: 13,
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
});

export default Post;
