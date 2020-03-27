import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { IPost } from "../../types";
import icons from "../../icons";
import colors from "../../colors";

const width = Dimensions.get("window").width;

type Props = {
  post: IPost;
  onPress: () => void;
};

const PostTile = ({ post, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={icons[post.category]}
            style={{ width: 64, height: 64 }}
          />
        </View>
        <View style={styles.outerCircle}></View>
        <View style={styles.circle}></View>
        <Text style={styles.text}>{post.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 44 * 4,
    paddingLeft: 25,
    width: width - 50,
    borderRadius: 10,
    marginBottom: 15,
    // borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  iconContainer: {
    width: 44 * 2,
    height: 44 * 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.orange,
  },
  icon: {},
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingHorizontal: 15,
    lineHeight: 18 * 2,
    flex: 1,
  },
  arrow: {
    marginHorizontal: 25,
    width: 24,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    position: "absolute",
    left: -2,
    top: -2,
    borderRadius: 20 / 2,
    width: 20 / 2,
    height: 20 / 2,
    backgroundColor: colors.background,
  },
  circle: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 16 / 2,
    width: 16 / 2,
    height: 16 / 2,
    backgroundColor: colors.orange,
  },
});

export default PostTile;
