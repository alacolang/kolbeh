import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Analytics from "appcenter-analytics";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import VideoCover from "./video";
import ImageCover from "./image";
import * as Types from "../../types";
import colors from "../../colors";
import MarkdownCover from "./markdown";
import { Icon } from "../icon";

type FeedNavigation = NavigationProp<ParentStackParamList, "parentFeed">;

type Props = {
  post: Types.IPostEdge;
};

const Post = ({ post }: Props) => {
  const Cover = {
    image: ImageCover,
    inapp: ImageCover,
    video: VideoCover,
    markdown: MarkdownCover,
  }[post.node.type];

  // const [saved, setSaved] = React.useState(false);
  const navigation = useNavigation<FeedNavigation>();

  const track = () => {
    Analytics.trackEvent("Post clicked", {
      category: post.node.category,
      type: post.node.type,
      id: post.node.id,
    });
  };

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
