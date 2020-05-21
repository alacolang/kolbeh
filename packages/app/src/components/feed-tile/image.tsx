import React from "react";
import { StyleSheet, Image, View } from "react-native";
import * as Types from "types";
import { resolveURL } from "utils/resolve";
import ProgressiveImage from "components/progressive-image";

type IProps = {
  post: Types.IPost;
};

const TheImage = ({ post }: IProps) => {
  if (!(post && post.images && post.images[0])) return null;
  const uri = resolveURL(post.images[0].url);

  return <ProgressiveImage uri={uri} />;
};

const styles = StyleSheet.create({
  image: { borderRadius: 10, marginHorizontal: 0 },
  backContainer: {
    position: "absolute",
    top: 14,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    width: 24,
    height: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  dot: {
    borderRadius: 9,
    margin: 2,
  },
  indexContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
  },
  index: {
    borderRadius: 24,
    width: 60,
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
});

export default TheImage;
