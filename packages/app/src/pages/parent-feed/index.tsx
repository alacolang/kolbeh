import React from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PostTile from "./post-tile";
import Loading from "../../components/loading";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import colors from "../../colors";
import icons from "../../icons";
import { IPost } from "../../types";

const GET_FEED = gql`
  query GetFeed {
    parentFeed {
      edges {
        node {
          id
          title
          imageUrl
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type IPostEdge = {
  node: IPost;
};

type ParentFeedNavigationProp = NavigationProp<
  ParentStackParamList,
  "parentPost"
>;

const ParentFeed = () => {
  const navigation = useNavigation<ParentFeedNavigationProp>();
  const { data, loading, error } = useQuery(GET_FEED);
  if (loading) {
    return <Loading />;
  }

  const feed: IPostEdge[] = data ? data.parentFeed.edges : {};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.clipContainer}>
        <Image source={icons.clip} style={{ width: 24, height: 24 }} />
      </View>
      {feed.map(({ node: post }) => (
        <PostTile
          key={post.id}
          post={post}
          onPress={() => navigation.navigate("parentPost", post)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  clipContainer: {
    position: "relative",
    bottom: -10,
    zIndex: 1000,
    paddingRight: 25 + 5,
    alignSelf: "flex-end",
    alignContent: "flex-end",
  },
  clip: {},
});

export default ParentFeed;
