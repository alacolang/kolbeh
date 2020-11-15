import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Keyboard,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "components/loading";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { IconSvg } from "components/icon";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";
import Post from "components/feed-tile";
import { trackEvent } from "utils/analytics";
import { NetworkStatus } from "apollo-client";

const fullWidth = Dimensions.get("window").width;

const HEADER_MIN_HEIGHT = 65;

const GET_POSTS = gql`
  query GetPosts($types: [PostType]) {
    posts(types: $types) {
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

const SearchScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, refetch, error, networkStatus } = useQuery<FeedData>(
    GET_POSTS,
    {
      variables: { types: ["image", "markdown", "video", "inapp"] },
    }
  );

  const [query, setQuery] = React.useState("");
  const [isTagsVisible, setTagsVisibility] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  if (error) {
    errorReport(error, { origin: "parent> get feed" });
    return (
      <View
        style={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.backgroundLight,
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
    );
  }

  const posts = (
    data || {
      posts: {
        edges: [],
        pageInfo: { endCursor: "", hasNextPage: false },
      } as Types.IFeed,
    }
  ).posts;

  const tags = Array.from(
    new Set(
      posts.edges
        .map((post) => post.node.tags)
        .reduce((acc, _tags) => acc.concat(_tags), [])
    )
  ).filter((x) => !!x);

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  const filteredTags = tags.filter((tag) =>
    query.length > 0 ? new RegExp(query).test(tag) : true
  );

  const searchItemsRendered = isTagsVisible && (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
    >
      {filteredTags.length > 0 &&
        filteredTags.slice(0, 10).map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => {
              trackEvent("search", { tag });
              setQuery(tag);
              Keyboard.dismiss();
              setTagsVisibility(false);
            }}
          >
            <View
              style={{
                marginHorizontal: 4,
                marginVertical: 4,
                borderRadius: 10,
                backgroundColor: colors.background,
                // borderWidth: 1,
              }}
            >
              <FormattedText
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  height: 30,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                {tag}
              </FormattedText>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );

  const searchInputRendered = (
    <>
      <TouchableOpacity
        onPress={() => {
          setTagsVisibility(true);
        }}
      >
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 44,
            height: 44,
          }}
        >
          <IconSvg name="search" size="tiny" color={colors.primary} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={{
          backgroundColor: colors.background,
          borderRadius: 30,
          elevation: 4,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: fullWidth * 0.7,
        }}
      >
        <TextInput
          // autoFocus={true}
          onFocus={() => {
            setTagsVisibility(true);
          }}
          style={{
            height: 40,
            paddingHorizontal: 15,
            fontSize: 16,
            lineHeight: 16,
            flex: 1,
            textAlign: "right",
            fontFamily: "IRANYekanRDMobile",
            color: colors.primary,
            // backgroundColor: "white",
          }}
          onChangeText={(text) => {
            setQuery(text);
          }}
          value={query}
        />
        {isTagsVisible && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setTagsVisibility(false);
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 44,
              justifyContent: "center",
              alignItems: "center",
              marginRight: -6,
            }}
          >
            <IconSvg name="timesFill" size="nano" color={colors.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </>
  );

  const itemsRendered = (
    <Animated.View
      style={{
        flexGrow: 1,
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={posts.edges.filter(
            ({ node }) => !query || (node.tags && node.tags.includes(query))
          )}
          renderItem={renderItem}
          keyExtractor={(item: Types.IPostEdge) => item.node.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </Animated.View>
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.headerContainer}>{searchInputRendered}</View>
        {searchItemsRendered}
      </View>
      {itemsRendered}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    height: HEADER_MIN_HEIGHT,
    // backgroundColor: colors.backgroundLight,
  },
  scrollViewContent: {
    paddingTop: 30,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 80,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundLight,
  },
});

export default SearchScreen;
