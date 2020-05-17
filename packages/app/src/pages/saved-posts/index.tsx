import React from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import { StackParamList } from "../../navigation/home-stack-navigator";
import gql from "graphql-tag";
import Loading from "components/loading";
import colors from "colors";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";
import Post from "components/feed-tile";
import { useSavedPosts } from "context/saved-posts";
import { Icon } from "components/icon";
import Curve from "../../components/curve";

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
type FeedNavigation = NavigationProp<StackParamList, "saved">;

const SavedPostsScreen = () => {
  const [savedPosts] = useSavedPosts();

  const navigation = useNavigation<FeedNavigation>();
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

  const headerRendered = (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          borderRadius: 44,
        }}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backContainer}>
          <Icon name="back" size="tiny" />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        {/* <FormattedText
          id="saved.title"
          style={{ color: "white", fontSize: 18 }}
        /> */}
      </View>
      <View style={{ justifyContent: "center" }}>
        <Icon name="saved" size="small" />
      </View>
      <Curve position="bottom-right" negative />
      <Curve position="bottom-left" negative />
    </View>
  );

  const itemsRendered = (
    <View
      style={{
        flexGrow: 1,
      }}
    >
      {headerRendered}
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
    flexDirection: "row",
    zIndex: 10,
    // paddingTop: 20,
    alignItems: "center",
    paddingHorizontal: 30,
    height: 60,
    backgroundColor: colors.backgroundVarient,
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SavedPostsScreen;
