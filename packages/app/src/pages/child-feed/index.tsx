import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  RefreshControl,
  InteractionManager,
} from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRoute, RouteProp } from "@react-navigation/core";
import { ChildStackParamList } from "navigation/child-stack-navigator";
import * as Types from "types";
import colors from "colors";
import FeedTile from "components/feed-tile";
import { NetworkStatus } from "apollo-client";
import { FormattedText } from "components/formatted-text";
import Loading from "components/loading";

export type FeedRouteParam = {
  categoryId: string;
};

type CategoryData = {
  categoryById: Types.ICategory;
};

const GET_CHILD_CATEGORY = gql`
  query GetChildCategory($categoryId: ID!) {
    categoryById(id: $categoryId) {
      id
      title
      description
      icon
      feed {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            title
            type
            category
            images {
              id
              url
            }
            videos {
              id
              url
              cover
            }
          }
        }
      }
    }
  }
`;

type FeedRoute = RouteProp<ChildStackParamList, "childFeed">;

const Feed = () => {
  const route = useRoute<FeedRoute>();
  const { categoryId } = route.params;

  const { data, error, networkStatus, loading, refetch } = useQuery<
    CategoryData
  >(GET_CHILD_CATEGORY, {
    variables: { categoryId }, //, types: ["image", "markdown", "video", "inapp"] },
  });

  const category = data?.categoryById;
  // if (!category) {
  // return null;
  // }

  const _refetch = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      if (refetch) {
        await refetch();
      }
    });
    return () => task.cancel();
  }, [refetch]);

  const feed = category?.feed.edges ?? [];

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <FeedTile post={item} />;
  };

  console.log({ feed, error, networkStatus });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* {loading && feed.length === 0 ? <Loading varient /> : null} */}

      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={feed}
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={_refetch}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
        ListEmptyComponent={() => (
          <View
            style={{
              // position: "absolute",
              // top: 0,
              zIndex: 10,
              height: 30,
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 36,
              backgroundColor: colors.backgroundLight,
              width: "100%",
            }}
          >
            {networkStatus === NetworkStatus.error ? (
              <FormattedText
                id="error.connection"
                style={{ color: colors.primary }}
              />
            ) : error ? (
              <FormattedText
                id="error.misc"
                style={{ color: colors.primary }}
              />
            ) : loading ? (
              <Loading varient />
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    paddingTop: 120,
    flex: 1,
  },
  scrollViewContent: {
    marginTop: 45,
    paddingBottom: 200,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default Feed;
