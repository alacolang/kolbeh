import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { IPost } from "./index";
const width = Dimensions.get("window").width;

type Props = {
  post: IPost;
};

const Post = ({ post }: Props) => {
  return (
    <View>
      {/* <Text>{post.title}</Text> */}
      <Image
        style={{
          height: (width / 600) * 1600,
          width: width,
        }}
        source={{ uri: "http://localhost:8000" + post.image }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Post;
