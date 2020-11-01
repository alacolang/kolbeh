import React from "react";
import { View, Image, StyleSheet, FlatList, Text } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/core";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import { ChildStackParamList } from "navigation/child-stack-navigator";
import { IconName } from "components/icon";
import icons from "components/icon/images";
import * as Types from "types";
import colors from "colors";
import FeedTile from "components/feed-tile";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormattedText } from "components/formatted-text";
import { GaussIcon } from "components/curve-icon";

export type FeedRouteParam = {
  category: Types.ICategory;
};

const ICON_SIZE = 50;

type FeedRoute =
  | RouteProp<ParentStackParamList, "parentFeed">
  | RouteProp<ChildStackParamList, "childFeed">;

const Feed = () => {
  const route = useRoute<FeedRoute>();
  const navigation = useNavigation();

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
      {/* <BackHeader navigation={navigation} title={category.title} /> */}
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

const BackHeader = ({ navigation, title }: any) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.back}>
        <GaussIcon onPress={() => navigation.goBack()} icon="rightArrow" />
      </View>
      <FormattedText style={styles.title}>{title}</FormattedText>
    </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    justifyContent: "center",
    backgroundColor: colors.backgroundVariant,
  },
  back: {
    width: 44,
    height: 84,
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    color: colors[1],
  },
});

export default Feed;
