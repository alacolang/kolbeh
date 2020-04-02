import React from "react";
import { StyleSheet, StatusBar, FlatList } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/core";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import * as Types from "../../types";
import colors from "../../colors";
import Post from "../../components/post";

type ParentNavigationProp = RouteProp<ParentStackParamList, "parentFeed">;

const Feed = () => {
  const route = useRoute<ParentNavigationProp>();
  const category = route.params;
  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  return (
    <>
      <StatusBar backgroundColor={"white"} barStyle="dark-content" />
      <FlatList
        contentContainerStyle={styles.outerContainer}
        data={feed.edges}
        renderItem={renderItem}
        // removeClippedSubviews={true}
        // initialNumToRender={1}
        // maxToRenderPerBatch={1}
        // windowSize={1}
        keyExtractor={(item) => item.node.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default Feed;
