import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/core";
import { ChildStackParamList } from "navigation/child-stack-navigator";
import { Icon } from "components/icon";
import * as Types from "types";
import colors from "colors";
import FeedTile from "components/feed-tile";
import TeenHeaderImg from "../../assets/images/teen-header.png";
import KidHeaderImg from "../../assets/images/kid-header.png";
import ToolboxHeaderImg from "../../assets/images/toolbox-header.png";

const fullWidth = Dimensions.get("window").width;

export type FeedRouteParam = {
  categoryId: string;
};

type CategoryData = {
  categoryById: Types.ICategory;
};

const GET_CHILD_CATEGORY = gql`
  query GetChildCategory($categoryId: ID!) {
    categoryById(id: $categoryId) {
      id
      title
      description
      icon
      feed {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            title
            type
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
          }
        }
      }
    }
  }
`;

type FeedRoute = RouteProp<ChildStackParamList, "childFeed">;
type FeedNavigation = NavigationProp<ChildStackParamList, "childFeed">;

const Feed = () => {
  const navigation = useNavigation<FeedNavigation>();
  const route = useRoute<FeedRoute>();
  const { categoryId } = route.params;

  const { data, loading, error } = useQuery<CategoryData>(GET_CHILD_CATEGORY, {
    variables: { categoryId }, //, types: ["image", "markdown", "video", "inapp"] },
  });

  const category = data?.categoryById;
  if (!category) return null;

  const feed = category.feed;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <FeedTile post={item} />;
  };

  const curveRendered = (
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
          // fill={meta.backgroundColor}
          clipPath="url(#cut-off-bottom)"
        />
      </Svg>
    </View>
  );

  const navbarRendered = (
    <View
      style={[
        styles.navbarContainer,
        // { backgroundColor: meta.backgroundColor },
      ]}
    >
      {curveRendered}
      <View style={styles.navbarRow}>
        <TouchableOpacity
          // activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backContainer}>
            <Icon name="back" size="tiny" />
          </View>
        </TouchableOpacity>
        <Icon name={category.icon} size="huge" />
      </View>
    </View>
  );

  const img = ({
    "child/kid": KidHeaderImg,
    "child/teen": TeenHeaderImg,
    "child/toolbox": ToolboxHeaderImg,
  } as Record<string, ImageSourcePropType>)[category.id];
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {img && <Image source={img} style={{ width: fullWidth, height: 200 }} />}
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={feed.edges}
        renderItem={renderItem}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
      />
      {navbarRendered}
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
    // marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navbarContainer: {
    flexGrow: 1,
    position: "absolute",
    bottom: 0,
    width: fullWidth,
    height: 100,
    // borderWidth: 2,
    borderColor: "red",
  },
  navbarRow: {
    flexDirection: "row",
    paddingHorizontal: 30,
    alignItems: "flex-end",
    // borderWidth: 1,
    justifyContent: "space-between",
  },
});

export default Feed;
