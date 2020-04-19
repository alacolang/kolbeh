import React from "react";
import {
  View,
  Easing,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  Share,
  Animated,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
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
import messages from "../../utils/fa";

const fullHeight = Dimensions.get("window").height;

const RADIUS_MAX = 60;
const HEADER_MAX_HEIGHT = (fullHeight / 6) * 2.5;
const HEADER_MIN_HEIGHT = 75;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

const ParentScreen = () => {
  const navigation = useNavigation<Navigation>();
  // const scrollAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const animateValue = React.useRef(new Animated.Value(0)).current;

  const [refreshing, setRefreshing] = React.useState(false);
  const [header, setHeader] = React.useState(false);
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

  const posts = (data || { posts: { edges: []} }).posts;

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

  let headerBackgroundColor = animateValue.interpolate({
    inputRange: [0, 0.3],
    outputRange: [colors.background, colors.primaryVarient],
    extrapolate: "clamp",
  });

  let triggerButtonBackgroundColor = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primaryVarient, "white"],
    extrapolate: "clamp",
  });

  let radius = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, RADIUS_MAX],
    extrapolate: "clamp",
  });

  let listMarginTop = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT + 30],
  });

  let menuElevation = animateValue.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0, 4],
    extrapolate: "clamp",
  });

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: messages["invite-others"] + "\n https://alacolang.ir/corona",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View
        style={
          {
            flexGrow: 1,
            marginTop: listMarginTop,
          }
        }
      >
        {loading && <Loading />}
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          data={posts.edges}
          renderItem={renderItem}
          // onScroll={Animated.event(
          //   [{ nativeEvent: { contentOffset: { y: scrollAnimatedValue } } }],
          //   { useNativeDriver: true }
          // )}
          // scrollEventThrottle={16}
          keyExtractor={(item: Types.IPostEdge) => item.node.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: HEADER_MIN_HEIGHT,
            backgroundColor: headerBackgroundColor,
            zIndex: 1,
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setHeader(!header);
            const [from, to] = !header ? [0, 1] : [1, 0];
            animateValue.setValue(from);
            Animated.timing(animateValue, {
              toValue: to,
              duration: 1000,
              easing: Easing.bezier(0.76, 0, 0.24, 1),
            }).start();
          }}
        >
          {true || !header ? (
            <Animated.View
              style={[
                styles.iconContainer,
                { backgroundColor: triggerButtonBackgroundColor },
              ]}
            >
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
            </Animated.View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon name="backActive" size={20} resizeMode="contain" />
            </View>
          )}
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            zIndex: 0,
            // elevation: menuElevation,
            height: HEADER_SCROLL_DISTANCE,
            backgroundColor: colors.primaryVarient,
            transform: [{ translateY: menuY }],
            borderBottomRightRadius: radius,
          },
        ]}
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
           {/* <View style={styles.headerRow}>
              <Icon name="save" size={40} />
              <FormattedText style={styles.iconTitle} id="saved.title" />
            </View> */}
          <TouchableOpacity onPress={() => onShare()}>
            <View style={styles.headerRow}>
              <Icon name="shareActive" size={40} />
              <FormattedText style={styles.iconTitle} id="invite-friends" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("contact")}>
            <View style={styles.headerRow}>
              <Icon name="info" size={40} />
              <FormattedText style={styles.iconTitle} id="contact-us" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    height: HEADER_MAX_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primaryVarient,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconTitle: { paddingRight: 15, color: colors.primary, fontSize: 18 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginTop: 20,
    marginLeft: 30,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 1.5,
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    // borderWidth: 10,
    // borderColor: "red",
    // paddingBottom: HEADER_MAX_HEIGHT + 30,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});

export default ParentScreen;
