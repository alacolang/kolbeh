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
import { FormattedText } from "../../components/formatted-text";

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
            source={icons[`${post.category}Active`]}
            style={{ width: 64, height: 64 }}
          />
        </View>
        <View style={styles.outerCircle}></View>
        <View style={styles.circle}></View>
        <FormattedText style={styles.text}>{post.title}</FormattedText>
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
    paddingHorizontal: 25,
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
    // padding: 10,
    // borderWidth: 2,
    // borderColor: colors.orange,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
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
    borderRadius: 36 / 2,
    width: 36 / 2,
    height: 36 / 2,
    backgroundColor: colors.background,
  },
  circle: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 28 / 2,
    width: 28 / 2,
    height: 28 / 2,
    backgroundColor: colors.orange,
  },
});

export default PostTile;
