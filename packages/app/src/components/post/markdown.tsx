import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as Types from "../../types";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { resolveURL } from "../../utils/resolve";

const frameWidth = Dimensions.get("window").width - 30 * 2;

type ISize = { width?: number; height: number };
type Props = {
  post: Types.IPost;
  track: () => void;
};

type FeedNavigation = NavigationProp<ParentStackParamList, "parentFeed">;

const Markdown = ({ post, track }: Props) => {
  const navigation = useNavigation<FeedNavigation>();

  const [size, setSize] = React.useState<ISize>({
    width: frameWidth,
    height: 200,
  });
  const uri = resolveURL(post.markdown.cover);

  React.useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        setSize({ height: (frameWidth / width) * height });
      },
      () => {}
    );
  }, [uri]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          track();
          navigation.navigate("post", { post });
        }}
      >
        <Image
          style={[styles.container, size]}
          source={{ uri }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: frameWidth,
    height: 100,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 30,
  },
});

export default Markdown;
