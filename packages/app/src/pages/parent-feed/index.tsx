import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  View,
  Image,
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
import { Icon, IconName } from "../../components/icon";
import icons from "../../components/icon/images";
import * as Types from "../../types";
import colors from "../../colors";
import FeedTile from "../../components/feed-tile";

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
    return <FeedTile post={item} />;
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
           <View
            style={{
              position: "absolute",
              top: -70,
              left: 0,
              right: 0,
              // zIndex: 2000,
              // borderWidth: 3,
              // borderColor: "blue",
              width: fullWidth,
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <Svg
              height={260}
              width={fullWidth}
              viewBox="-36 0 370 281"
              preserveAspectRatio="none"
              // style={{
              //   borderWidth: 5,
              //   borderColor: "gray",
              // }}
            >
              <Defs>
                <ClipPath id="cut-off-bottom">
                  <Rect x="-40" y="150" width="374" height="100" />
                </ClipPath>
              </Defs>
              <Path
                d="m -35.773602,29.252132 c 0.71934,-15.9945 13.89777,-28.43639976 29.9084703,-28.43639976 H 303.89657 c 16.569,0 30,13.43149976 30,29.99999976 V 195.54973 c 0,21.984 -23.012,36.858 -43.419,28.684 -94.128,-37.706 -309.775262,-109.356 -324.940472,18.564 -16.25383,137.102 -5.32963,-124.184 -1.3107,-213.545598 z"
                fill={colors.backgroundVarient}
                clipPath="url(#cut-off-bottom)"
              />
            </Svg>
          </View>
          <Animated.View
            style={{
              opacity: backOpacity,
              // borderWidth: 1,
              transform: [
                {
                  translateY: scrollAnimatedValue.interpolate({
                    inputRange: [
                      HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                      HEADER_SCROLL_DISTANCE,
                    ],
                    outputRange: [0, -HEADER_MIN_HEIGHT + ICON_SIZE + 10],
                    extrapolate: "clamp",
                  }),
                },
              ],
              flexGrow: 1,
            }}
          >
            <TouchableOpacity
              // activeOpacity={0.5}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backContainer}>
                <Icon name="back" size="tiny" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                {
                  scale: scrollAnimatedValue.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [1.3, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: scrollAnimatedValue.interpolate({
                      inputRange: [
                        HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                        HEADER_SCROLL_DISTANCE,
                      ],
                      outputRange: [40, 30],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              <Animated.View
                style={{
                  // paddingLeft: 0,
                  // borderWidth: 1,
                  transform: [
                    {
                      translateY: scrollAnimatedValue.interpolate({
                        inputRange: [
                          HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT,
                          HEADER_SCROLL_DISTANCE,
                        ],
                        outputRange: [
                          -ICON_SIZE * 0.3 * 2,
                          -HEADER_MIN_HEIGHT / 4,
                        ],
                        extrapolate: "clamp",
                      }),
                    },
                  ],
                }}
              >
                <Image
                  source={icons[`${category.icon}Active` as IconName]}
                  style={styles.categoryIcon}
                  resizeMode="cover"
                />
              </Animated.View>
            </Animated.View>
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
    flexDirection: "column",
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    height: HEADER_MAX_HEIGHT,
    top: 0,
    left: 0,
    right: 0,
    elevation: 4,
    // borderWidth: 5,
    borderColor: "blue",
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
    // height: HEADER_MIN_HEIGHT,
    // width: fullWidth,
    flexDirection: "row",
    alignItems: "flex-end",
    // borderWidth: 1,
    borderColor: "red",
    // backgroundColor: 'grey'
    paddingLeft: 5,
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
    // borderColor: "red",
  },
  categoryIcon: {
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    // borderWidth: 1,
    // borderColor: "black",
  },
});

export default Feed;
