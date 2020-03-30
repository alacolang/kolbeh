import React from "react";
import {
  RefreshControl,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PostTile from "./post-tile";
import Loading from "../../components/loading";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import colors from "../../colors";
import { IPost } from "../../types";

const GET_FEED = gql`
  query GetFeed {
    parentFeed {
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

type ParentFeedNavigationProp = NavigationProp<
  ParentStackParamList,
  "parentPost"
>;

const ParentFeed = () => {
  const navigation = useNavigation<ParentFeedNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, refetch, error } = useQuery(GET_FEED);
  if (loading) {
    return <Loading />;
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refreshing]);

  const feed: IPostEdge[] = data ? data.parentFeed.edges : [];
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {feed.map(({ node: post }, index) => (
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
    paddingTop: 30,
  },
});

export default ParentFeed;
