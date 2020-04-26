import React from "react";
import { Dimensions, StyleSheet, Image } from "react-native";
import * as Types from "../../types";
import { resolveURL } from "../../utils/resolve";

const frameWidth = Dimensions.get("window").width - 40 * 2;

type Props = {
  post: Types.IPost;
};

const Markdown = ({ post }: Props) => {
  const uri = resolveURL(post.markdown.cover);

  return <Image style={styles.container} source={{ uri }} resizeMode="cover" />;
};

const styles = StyleSheet.create({
  container: {
    width: frameWidth,
    height: frameWidth,
  },
});

export default Markdown;
