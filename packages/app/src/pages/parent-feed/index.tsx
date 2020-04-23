import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Animated,
  StyleSheet,
  StatusBar,
  FlatList,
} from "react-native";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/core";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import { ChildStackParamList } from "../../navigation/child-stack-navigator";
import Icons from "../../components/icon";
import * as Types from "../../types";
import colors from "../../colors";
import Post from "../../components/post";

const fullHeight = Dimensions.get("window").height;
const fullWidth = Dimensions.get("window").width;

export type FeedRouteParam = {
  category: Types.ICategory;
  meta: {
    backgroundColor: string;
    color: string;
  };
};

const ICON_SIZE = 40;
const RADIUS_MAX = 60;
const HEADER_MAX_HEIGHT = (fullHeight / 3) * 2;
const HEADER_MIN_HEIGHT = (fullHeight / 3) * 0.8;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

type FeedRoute =
  | RouteProp<ParentStackParamList, "parentFeed">
  | RouteProp<ChildStackParamList, "childFeed">;
type FeedNavigation = NavigationProp<ParentStackParamList, "parentFeed">;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Feed = () => {
  const scrollAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<FeedNavigation>();
  const route = useRoute<FeedRoute>();

  const { category, meta } = route.params;
  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  let translateTab = scrollAnimatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  let descriptionOpacity = scrollAnimatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  let backOpacity = scrollAnimatedValue.interpolate({
    inputRange: [
      HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  let radius = scrollAnimatedValue.interpolate({
    inputRange: [
      HEADER_SCROLL_DISTANCE / 2 - HEADER_MIN_HEIGHT,
      HEADER_SCROLL_DISTANCE,
    ],
    outputRange: [RADIUS_MAX, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <AnimatedFlatList
        contentContainerStyle={styles.scrollViewContent}
        data={feed.edges}
        renderItem={renderItem}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnimatedValue } } }],
          { useNativeDriver: true }
        )}
        // removeClippedSubviews={true}
        // initialNumToRender={1}
        // maxToRenderPerBatch={1}
        // windowSize={1}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
      />
      <Animated.View
        style={[
          styles.headerContainer,
          {
            backgroundColor: colors.backgroundVarient,
            transform: [{ translateY: translateTab }],
            // borderBottomLeftRadius: radius,
            // borderBottomRightRadius: radius,
          },
        ]}
      >
        <View style={styles.descriptionContainer}>
          <Animated.Text
            style={[
              styles.title,
              { color: meta.color, opacity: descriptionOpacity },
            ]}
          >
            {category.description}
          </Animated.Text>
        </View>
        <View style={styles.topBarContainer}>
          <View style={{ position: "absolute", top: -70, left: 0, right: 0 }}>
            <Svg
              height={260}
              width={fullWidth}
              // viewBox="0 0 360 281"
            >
              <Defs>
                <ClipPath id="cut-off-bottom">
                  <Rect x="0" y="150" width={fullWidth} height="100" />
                </ClipPath>
              </Defs>

              <Path
                d="M-9.67017 28.4364C-8.95083 12.4419 4.2276 0 20.2383 0H330C346.569 0 360 13.4315 360 30V194.734C360 216.718 336.988 231.592 316.581 223.418C222.453 185.712 6.80574 114.062 -8.35947 241.982C-24.6133 379.084 -13.6891 117.798 -9.67017 28.4364Z"
                fill={colors.backgroundVarient}
                clipPath="url(#cut-off-bottom)"
              />
            </Svg>
          </View>
          <Animated.View
            style={{
              opacity: backOpacity,
              // borderWidth: 1,
              translateY: scrollAnimatedValue.interpolate({
                inputRange: [
                  HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                  HEADER_SCROLL_DISTANCE,
                ],
                outputRange: [-20, -HEADER_MIN_HEIGHT / 1.8],
                extrapolate: "clamp",
              }),
              flexGrow: 1,
            }}
          >
            <TouchableOpacity
              // activeOpacity={0.5}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backContainer}>
                <Image
                  source={Icons.back}
                  resizeMode="contain"
                  style={styles.back}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              // paddingLeft: 0,
              // borderWidth: 1,
              transform: [
                {
                  scale: scrollAnimatedValue.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [1.3, 1],
                    extrapolate: "clamp",
                  }),

                  translateX: scrollAnimatedValue.interpolate({
                    inputRange: [
                      HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                      HEADER_SCROLL_DISTANCE,
                    ],
                    outputRange: [40, 30],
                    extrapolate: "clamp",
                  }),
                  translateY: scrollAnimatedValue.interpolate({
                    inputRange: [
                      HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                      HEADER_SCROLL_DISTANCE,
                    ],
                    outputRange: [-20, -HEADER_MIN_HEIGHT / 4],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Image
              source={Icons[`${category.icon}Active`]}
              style={styles.categoryIcon}
              resizeMode="cover"
            />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT + 70,
    paddingBottom: HEADER_MAX_HEIGHT + 70,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    height: HEADER_MAX_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    // borderBottomLeftRadius: RADIUS_MAX,
    elevation: 4,
    // overflow: "hidden",
  },
  title: {
    fontFamily: "IRANYekanRDMobile",
    paddingHorizontal: 30,
    fontSize: 22,
    lineHeight: 2 * 22,
    textAlign: "center",
  },
  headerIcon: {
    marginLeft: 60,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  descriptionContainer: {
    flex: 1,
    alignItems: "center",
    // borderWidth: 2,
    // borderColor: "yellow",
    justifyContent: "center",
  },
  topBarContainer: {
    width: fullWidth,
    // height: 280,
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "cyan",
    paddingLeft: 20,
    // paddingTop: 20,
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
    borderColor: "red",
  },
  back: {
    width: 24,
    height: 24,
  },
  categoryIcon: {
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    // borderWidth: 1,
    // borderColor: "black",
  },
});

export default Feed;
