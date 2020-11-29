import colors from "colors";
import Post from "components/feed-tile";
import { FormattedText } from "components/formatted-text";
import Loading from "components/loading";
import { useBookmarkedPosts } from "context/bookmark-posts";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import * as Types from "types";
import { useQuery } from "@apollo/react-hooks";
import { NetworkStatus } from "apollo-client";
import { useConnectivity } from "context/connectivity";

const HEADER_HEIGHT = 180;

const GET_POSTS = gql`
  query {
    posts {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          category
          tags
          type
          images {
            id
            url
          }
          videos {
            id
            url
            cover
          }
          markdown {
            content
            cover
          }
        }
      }
    }
  }
`;

type FeedData = {
  posts: Types.IFeed;
};

const BookmarkPostsScreen = () => {
  const [savedPosts] = useBookmarkedPosts();

  const { data, loading, error, refetch, networkStatus } = useQuery<FeedData>(
    GET_POSTS,
    {
      fetchPolicy: "cache-first",
    }
  );

  // if (error) {
  //   errorReport(error, { origin: "parent> get feed" });
  //   return null;
  // }

  const posts = (
    data || {
      posts: {
        edges: [],
        pageInfo: { endCursor: "", hasNextPage: false },
      } as Types.IFeed,
    }
  ).posts;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };
  const bookmarkedPosts: Types.IPostEdge[] = posts.edges.filter(({ node }) =>
    savedPosts.includes(node.id)
  );
  const { isConnected } = useConnectivity();

  useEffect(() => {
    if (posts.edges.length === 0 && isConnected) {
      refetch();
    }
  }, [isConnected, refetch, posts.edges.length]);

  const itemsRendered = (
    <View
      style={{
        flexGrow: 1,
      }}
    >
      {bookmarkedPosts.length === 0 && error ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          {networkStatus === NetworkStatus.error ? (
            <FormattedText
              id="error.connection"
              style={{ color: colors.primary }}
            />
          ) : (
            <FormattedText id="error.misc" style={{ color: colors.primary }} />
          )}
        </View>
      ) : loading ? (
        <Loading />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={bookmarkedPosts}
          renderItem={renderItem}
          keyExtractor={(item: Types.IPostEdge) => item.node.id}
          ListEmptyComponent={() => (
            <FormattedText
              id="bookmarkPage.empty"
              style={{ color: colors.primary }}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.headerContainer}>
        <FormattedText
          id="screen-title.bookmark"
          style={{ color: colors[1], fontSize: 24 }}
        />
      </View>
      {itemsRendered}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    marginTop: 30,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: HEADER_HEIGHT,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
});

export default BookmarkPostsScreen;
