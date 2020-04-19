import React from "react";
import {
  View,
  TouchableOpacity,
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
  const scrollAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const [refreshing, setRefreshing] = React.useState(false);
  const [header, setHeader] = React.useState(true);
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

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }
  const posts = data.posts;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  let translateTab = scrollAnimatedValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
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
      <AnimatedFlatList
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            marginTop: header ? HEADER_MAX_HEIGHT + 30 : HEADER_MIN_HEIGHT,
          },
        ]}
        data={posts.edges}
        renderItem={renderItem}
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: scrollAnimatedValue } } }],
        //   { useNativeDriver: true }
        // )}
        scrollEventThrottle={16}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Animated.View
        style={[
          styles.headerContainer,
          {
            elevation: header ? 4 : 0,
            height: header ? HEADER_MAX_HEIGHT : HEADER_MIN_HEIGHT,
            backgroundColor: header ? colors.primaryVarient : colors.background,
            translateY: translateTab,
            // borderBottomLeftRadius: radius,
            borderBottomRightRadius: header ? radius : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setHeader(!header);
          }}
        >
          {true || !header ? (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: header ? "white" : colors.primaryVarient },
              ]}
            >
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon name="backActive" size={20} resizeMode="contain" />
            </View>
          )}
        </TouchableOpacity>
        {header && (
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
        )}
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
    borderBottomRightRadius: RADIUS_MAX,
    backgroundColor: colors.primaryVarient,
    // overflow: "hidden",
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
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,

    // elevation: 7,
  },
  iconDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 1.5,
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT + 30,
    paddingBottom: HEADER_MAX_HEIGHT + 30,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.background,
  },
});

export default ParentScreen;
