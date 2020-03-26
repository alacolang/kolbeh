import React from "react";
import { View, Image, Dimensions } from "react-native";
const width = Dimensions.get("window").width;
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { useRoute, RouteProp } from "@react-navigation/core";
import config from '../../config'

console.log({ config })

type ParentFeedNavigationProp = RouteProp<ParentStackParamList, "parentPost">;

const Post = () => {
  const route = useRoute<ParentFeedNavigationProp>();
  const post = route.params;
  return (
    <View>
      <Image
        style={{
          height: (width / 600) * 1600,
          width: width,
        }}
        source={{ uri: config.HOST + post.imageUrl }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Post;
