import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  View,
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

type FeedRoute = RouteProp<ChildStackParamList, "childFeed">;
type FeedNavigation = NavigationProp<ChildStackParamList, "childFeed">;

const Feed = () => {
  const navigation = useNavigation<FeedNavigation>();
  const route = useRoute<FeedRoute>();

  const { category, meta } = route.params;
  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={feed.edges}
        renderItem={renderItem}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
      />
      <View
        style={{
          flexGrow: 1,
          position: "absolute",
          bottom: 0,
          width: fullWidth,
          height: 100,
          backgroundColor: meta.backgroundColor,
          // borderWidth: 2,
          borderColor: "red",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -130,
            // borderWidth: 2,
            borderColor: "green",
            left: 0,
            right: 0,
          }}
        >
          <Svg
            height={260}
            width={fullWidth}
            // viewBox="0 0 360 281"
          >
            <Defs>
              <ClipPath id="cut-off-bottom">
                <Rect x="0" y="60" width={fullWidth} height="70" />
              </ClipPath>
            </Defs>

            <Path
              d="M0 103C60 -37 297.424 245.744 438 56.5C578.576 -132.744 360 218 360 218H0V103Z"
              fill={meta.backgroundColor}
              clipPath="url(#cut-off-bottom)"
            />
          </Svg>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 30,
            alignItems: "flex-end",
            justifyContent: "space-between",
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
          <View
            style={
              {
                // paddingLeft: 0,
                // borderWidth: 1,
              }
            }
          >
            <Image
              source={Icons[`${category.icon}`]}
              style={styles.categoryIcon}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    marginTop: 45,
    paddingBottom: 200,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
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
    width: 40 * 2,
    height: 40 * 2,
    // borderWidth: 1,
    borderColor: "black",
  },
});

export default Feed;