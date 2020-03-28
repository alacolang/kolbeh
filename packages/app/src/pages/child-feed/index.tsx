import React from "react";
import { StatusBar, StyleSheet, ScrollView } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PostTile from "./post-tile";
import Loading from "../../components/loading";
import { ChildStackParamList } from "../../navigation/child-stack-navigator";
import colors from "../../colors";
import { IPost } from "../../types";

const GET_FEED = gql`
  query GetChildFeed {
    childFeed {
      edges {
        node {
          id
          category
          title
          videos {
            url
            cover
          }
          images {
            url
          }
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

type ChildFeedNavigationProp = NavigationProp<ChildStackParamList, "childPost">;

const ChildFeed = () => {
  const navigation = useNavigation<ChildFeedNavigationProp>();
  const { data, loading, error } = useQuery(GET_FEED);
  if (loading) {
    return <Loading />;
  }

  const feed: IPostEdge[] = data ? data.childFeed.edges : {};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {feed.map(({ node: post }, index) => (
        <PostTile
          key={post.id}
          post={post}
          onPress={() => navigation.navigate("childPost", post)}
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
    paddingTop: 30,
  },
});

export default ChildFeed;
