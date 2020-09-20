import React from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/core";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import { ChildStackParamList } from "navigation/child-stack-navigator";
import { Icon, IconName } from "components/icon";
import icons from "components/icon/images";
import * as Types from "types";
import colors from "colors";
import FeedTile from "components/feed-tile";

export type FeedRouteParam = {
  category: Types.ICategory;
};

const ICON_SIZE = 40;

type FeedRoute =
  | RouteProp<ParentStackParamList, "parentFeed">
  | RouteProp<ChildStackParamList, "childFeed">;
// type FeedNavigation = NavigationProp<ParentStackParamList, "parentFeed">;

const Feed = () => {
  const route = useRoute<FeedRoute>();

  const { category } = route.params;
  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <FeedTile post={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        ListHeaderComponent={
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description]}>{category.description}</Text>
            <Image
              source={icons[`${category.icon}` as IconName]}
              style={styles.categoryIcon}
              resizeMode="cover"
            />
          </View>
        }
        data={feed.edges}
        renderItem={renderItem}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    marginTop: 15,
    paddingBottom: 25,
    flexDirection: "column",
    alignItems: "center",
  },
  description: {
    fontFamily: "IRANYekanRDMobile",
    paddingHorizontal: 30,
    fontSize: 22,
    lineHeight: 2 * 22,
    textAlign: "center",
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  categoryIcon: {
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    // borderWidth: 1,
    // borderColor: "black",
    alignSelf: "flex-end",
    marginHorizontal: 30,
  },
});

export default Feed;
