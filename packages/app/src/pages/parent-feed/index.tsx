import React from "react";
import { View, Image, StyleSheet, FlatList, Text } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/core";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import { IconName } from "components/icon";
import icons from "components/icon/images";
import * as Types from "types";
import colors from "colors";
import FeedTile from "components/feed-tile";
import { SafeAreaView } from "react-native-safe-area-context";
import { log } from "utils/log";

export type FeedRouteParam = {
  category: Types.ICategory;
};

const ICON_SIZE = 50;

type FeedRoute = RouteProp<ParentStackParamList, "parentFeed">;

const Feed = () => {
  const route = useRoute<FeedRoute>();

  const { category } = route.params;
  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <FeedTile post={item} />;
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.backgroundVariant,
      }}
      edges={["top"]}
    >
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollViewContent}
          ListHeaderComponent={
            <View style={styles.descriptionContainer}>
              <Text style={[styles.description]}>{category.description}</Text>
              <Image
                source={icons[`${category.icon}` as IconName]}
                style={styles.categoryIcon}
                resizeMode="contain"
                onError={(e) => {
                  log("image failed", e);
                }}
              />
            </View>
          }
          data={feed.edges}
          renderItem={renderItem}
          keyExtractor={(item: Types.IPostEdge) => item.node.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundVariant,
  },
  scrollViewContent: {
    paddingBottom: 25,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  description: {
    fontFamily: "IRANYekanRDMobile",
    paddingHorizontal: 30,
    fontSize: 22,
    lineHeight: 2 * 22,
    textAlign: "center",
    color: colors.primary,
  },
  descriptionContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.backgroundVariant,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  categoryIcon: {
    width: ICON_SIZE * 2,
    height: ICON_SIZE * 2,
    transform: [{ rotateY: "180deg" }],
    alignSelf: "flex-end",
    marginHorizontal: 30,
  },
});

export default Feed;
