import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { IPost } from '../../types'
const width = Dimensions.get("window").width;

type Props = {
  post: IPost;
  onPress: () => void;
};

const PostTile = ({ post, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{post.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    marginBottom: 10,
    width: width - 50,
  },
  text: {},
});

export default PostTile;
