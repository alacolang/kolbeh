import React from "react";
import {
  View,
  TextInput,
  Easing,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Keyboard,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "components/loading";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { Icon } from "components/icon";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";
import Post from "components/feed-tile";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { onShare } from "utils/share";
import Curve from "components/curve";
import { SafeAreaView } from "react-native-safe-area-context";

const fullHeight = Dimensions.get("window").height;
const fullWidth = Dimensions.get("window").width;

const HEADER_MAX_HEIGHT = (fullHeight / 6) * 2.5;
const HEADER_MIN_HEIGHT = 65;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

type Navigation = NavigationProp<HomeStackParamList, "search">;

const SearchScreen = () => {
  const navigation = useNavigation<Navigation>();
  const animateValue = React.useRef(new Animated.Value(0)).current;

  const [refreshing, setRefreshing] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(true);
  const { data, loading, refetch, error } = useQuery<FeedData>(GET_POSTS, {
    variables: { types: ["image", "markdown", "video", "inapp"] },
  });

  const searchAnimateValue = React.useRef(new Animated.Value(0)).current;
  const [query, setQuery] = React.useState("");
  const [isSearchVisible, setSearchVisibility] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

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

  const tags = Array.from(
    new Set(
      posts.edges
        .map((post) => post.node.tags)
        .reduce((acc, tags) => acc.concat(tags), [])
    )
  ).filter((x) => !!x);

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  let menuY = animateValue.interpolate({
    inputRange: [0.3, 1],
    outputRange: [
      -HEADER_SCROLL_DISTANCE + HEADER_MIN_HEIGHT,
      HEADER_MIN_HEIGHT,
    ],
    extrapolate: "clamp",
  });

  let listMarginTop = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT + 30],
  });

  type Command = "open" | "close" | "toggle";
  const handleMenu = (command: Command, cb = () => {}) => {
    setMenuOpen(command === "toggle" ? !isMenuOpen : command === "open");
    if (
      (command === "close" && !isMenuOpen) ||
      (command === "open" && isMenuOpen)
    ) {
      cb();
      return;
    }
    // const [from, to] = !isMenuOpen ? [0, 1] : [1, 0];
    // animateValue.setValue(from);
    // Animated.timing(animateValue, {
    //   toValue: to,
    //   duration: 800,
    //   easing: Easing.bezier(0.76, 0, 0.24, 1),
    //   useNativeDriver: true,
    // }).start(cb);
  };

  const handleSearch = (command: Command) => {
    if (
      (command === "close" && !isSearchVisible) ||
      (command === "open" && isSearchVisible)
    ) {
      return;
    }

    if (isSearchVisible) {
      Keyboard.dismiss();
    }
    // const [from, to] = !isSearchVisible ? [0, 1] : [1, 0];
    // searchAnimateValue.setValue(from);
    // Animated.timing(searchAnimateValue, {
    //   toValue: to,
    //   duration: 500,
    //   easing: Easing.bezier(0.76, 0, 0.24, 1),
    //   useNativeDriver: true,
    // }).start();
  };

  const filteredTags = tags.filter((tag) =>
    query.length > 0 ? new RegExp(query).test(tag) : true
  );

  const menuRendered = !isSearchVisible && (
    <View
      style={{
        flexDirection: "column",
        // borderWidth: 1,
        paddingLeft: 30,
        flexGrow: 1,
        justifyContent: "space-evenly",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          handleMenu("close");
          navigation.navigate("saved");
        }}
      >
        <View style={styles.menuItem}>
          <Icon name="saved" size={40} />
          <FormattedText style={styles.menuItemTitle} id="saved.title" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onShare()}>
        <View style={styles.menuItem}>
          <Icon name="shareActive" size={40} />
          <FormattedText style={styles.menuItemTitle} id="invite-friends" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleMenu("close");
          navigation.navigate("contact");
        }}
      >
        <View style={styles.menuItem}>
          <Icon name="info" size={40} />
          <FormattedText style={styles.menuItemTitle} id="contact-us" />
        </View>
      </TouchableOpacity>
    </View>
  );

  // const triggerMenuRendered = !isSearchVisible && (
  //   <TouchableOpacity
  //     style={styles.menuTrigger}
  //     onPress={() => {
  //       handleMenu("toggle");
  //     }}
  //   >
  //     <View style={styles.dotContainer}>
  //       <View style={styles.dot} />
  //       <View style={styles.dot} />
  //     </View>
  //   </TouchableOpacity>
  // );

  const searchItemsRendered = isSearchVisible && (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        // flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
        // borderWidth: 1,
        // backgroundColor: colors.backgroundVariant,
        // backgroundColor: "red",
        // height: 100
      }}
    >
      {filteredTags.length > 0 &&
        filteredTags.slice(0, 10).map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => {
              setQuery(tag);
              Keyboard.dismiss();
              handleMenu("close", () => setSearchVisibility(false));
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
          setSearchVisibility(true);
          // handleSearch("open");
          // handleMenu("open");
        }}
      >
        <Animated.View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 44,
            height: 44,
            // borderWidth: 2,
          }}
        >
          <Icon name="search" size="tiny" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={{
          backgroundColor: colors.background,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: fullWidth * 0.7,
          // borderWidth: 1,
        }}
      >
        <TextInput
          // autoFocus={true}
          onFocus={() => {
            handleMenu("open");
          }}
          style={{
            height: 35,
            paddingHorizontal: 15,
            fontSize: 16,
            lineHeight: 16,
            flex: 1,
            textAlign: "right",
            fontFamily: "IRANYekanRDMobile",
            color: colors.primary,
          }}
          onChangeText={(text) => {
            setQuery(text);
          }}
          value={query}
        />
        {isSearchVisible && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              // handleSearch("close");
              handleMenu(
                "close"
                // () => setSearchVisibility(false)
              );
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
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 20,
                backgroundColor: "lightgrey",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="times" size="nano" />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
    </>
  );

  const itemsRendered = (
    <Animated.View
      style={{
        flexGrow: 1,
        // transform: [{ translateY: listMarginTop }],
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
        {/* <Animated.View
          style={[
            styles.menuContainer,
            // { transform: [{ translateY: menuY }] }
          ]}
        > */}
        {searchItemsRendered}
        {/* </Animated.View> */}
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
    backgroundColor: colors.backgroundVariant,
    // backgroundColor: "yellow",
  },
  menuContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    // height: HEADER_SCROLL_DISTANCE,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    paddingHorizontal: 15,
    color: colors.secondary,
    fontSize: 18,
  },
  menuTrigger: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  dotContainer: {
    flex: 1,
    // borderWidth: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    margin: 2,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    paddingTop: 30,
    // marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 80,
    backgroundColor: colors.backgroundVariant,
  },
  container: {
    flexGrow: 1,
    // borderWidth: 1,
    backgroundColor: colors.backgroundVariant,
    // backgroundColor: "red",
  },
});

export default SearchScreen;
