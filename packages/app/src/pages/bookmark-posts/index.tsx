import colors from 'colors';
import Post from 'components/feed-tile';
import { FormattedText } from 'components/formatted-text';
import Loading from 'components/loading';
import { useBookmarkedPosts } from 'context/bookmark-posts';
import gql from 'graphql-tag';
import { HomeStackParamList } from 'navigation/home-stack-navigator';
import React from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import * as Types from 'types';
import { errorReport } from 'utils/error-reporter';

import { useQuery } from '@apollo/react-hooks';
import { NavigationProp, useNavigation } from '@react-navigation/core';

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
type FeedNavigation = NavigationProp<HomeStackParamList, "saved">;

const BookmarkPostsScreen = () => {
  const [savedPosts] = useBookmarkedPosts();

  const { data, loading, error } = useQuery<FeedData>(GET_POSTS);

  if (error) {
    errorReport(error, { origin: "parent> get feed" });
    return null;
  }

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

  const itemsRendered = (
    <View
      style={{
        flexGrow: 1,
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={posts.edges.filter(({ node }) => savedPosts.includes(node.id))}
          renderItem={renderItem}
          keyExtractor={(item: Types.IPostEdge) => item.node.id}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.headerContainer}>
        <FormattedText
          id="bookmark.title"
          style={{ color: colors.secondary, fontSize: 24 }}
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
