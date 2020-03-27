import React from "react";
import { View, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { useRoute, RouteProp } from "@react-navigation/core";
import config from "../../config";
import colors from "../../colors";

type ParentFeedNavigationProp = RouteProp<ParentStackParamList, "parentPost">;

const width = Dimensions.get("window").width - 15 * 2;

const Post = () => {
  const route = useRoute<ParentFeedNavigationProp>();
  const post = route.params;
  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        {post.images.map((image) => (
          <Image
            style={{
              height: (width / 600) * 1600,
              width: width,
              borderRadius: 20,
              borderWidth: 10,
              borderColor: "white",
            }}
            source={{ uri: config.HOST + image.url }}
            resizeMode="cover"
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  container: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    // borderWidth: 1,
    borderRadius: 40,
  },
});

export default Post;
