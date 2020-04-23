import React from "react";
import {
  View,
  Easing,
  TouchableOpacity,
  RefreshControl,
  Animated,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "../../components/loading";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";
import { Icon } from "../../components/icon";
import * as Types from "../../types";
import { errorReport } from "../../utils/error-reporter";
import Post from "../../components/post";
import { HomeStackParamList } from "../../navigation/home-stack-navigator";
import { onShare } from "../../utils/share";
import Curve from "../../components/curve";

const fullHeight = Dimensions.get("window").height;

const HEADER_MAX_HEIGHT = (fullHeight / 6) * 2.5;
const HEADER_MIN_HEIGHT = 75;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const GET_POSTS = gql`
  query {
    posts {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          title
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
          markdown {
            content
            cover
          }
        }
      }
    }
  }
`;

type ParentCategoriesData = {
  posts: Types.IFeed;
};

type Navigation = NavigationProp<HomeStackParamList, "home">;

const MainFeedScreen = () => {
  const navigation = useNavigation<Navigation>();
  const animateValue = React.useRef(new Animated.Value(0)).current;

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused

  //     setMenuOpen(false)
  //     return () => {
  //       // Do something when the screen is unfocused
  //       // Useful for cleanup functions
  //     };
  //   }, [])

  const [refreshing, setRefreshing] = React.useState(false);
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const { data, loading, refetch, error } = useQuery<ParentCategoriesData>(
    GET_POSTS
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  if (error) {
    errorReport(error, { origin: "parent> get feed" });
    return null;
  }

  const posts = (data || { posts: { edges: [] } }).posts;

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

  const toggleMenu = (cb = () => {}) => {
    setMenuOpen(!isMenuOpen);
    const [from, to] = !isMenuOpen ? [0, 1] : [1, 0];
    animateValue.setValue(from);
    Animated.timing(animateValue, {
      toValue: to,
      duration: 1000,
      easing: Easing.bezier(0.76, 0, 0.24, 1),
    }).start(cb);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={{
          flexGrow: 1,
          marginTop: listMarginTop,
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            contentContainerStyle={styles.scrollViewContent}
            data={posts.edges}
            renderItem={renderItem}
            keyExtractor={(item: Types.IPostEdge) => item.node.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </Animated.View>

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.menuTrigger}
          onPress={() => {
            toggleMenu();
          }}
        >
          <View style={styles.dotContainer}>
            <View style={styles.dot}></View>
            <View style={styles.dot}></View>
          </View>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[styles.menuContainer, { transform: [{ translateY: menuY }] }]}
      >
        <View
          style={{
            flexDirection: "column",
            // borderWidth: 1,
            paddingLeft: 30,
            flexGrow: 1,
            justifyContent: "space-evenly",
          }}
        >
          {/* <View style={styles.menuItem}>
              <Icon name="save" size={40} />
              <FormattedText style={styles.menuItemTitle} id="saved.title" />
            </View> */}
          <TouchableOpacity onPress={() => onShare()}>
            <View style={styles.menuItem}>
              <Icon name="shareActive" size={40} />
              <FormattedText style={styles.menuItemTitle} id="invite-friends" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu(() => {
                navigation.navigate("contact");
              });
            }}
          >
            <View style={styles.menuItem}>
              <Icon name="info" size={40} />
              <FormattedText style={styles.menuItemTitle} id="contact-us" />
            </View>
          </TouchableOpacity>
        </View>
        <Curve position="bottom-right" negative />
        <Curve position="bottom-left" negative />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 30,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: colors.backgroundVarient,
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 0,
    zIndex: 0,
    height: HEADER_SCROLL_DISTANCE,
    backgroundColor: colors.backgroundVarient,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: { paddingRight: 15, color: colors.secondary, fontSize: 18 },
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
    marginTop: 30,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});

export default MainFeedScreen;
