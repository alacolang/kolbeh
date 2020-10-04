import React from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import CategoryTile from "./category-tile";
import Loading from "components/loading";
import { ChildStackParamList } from "navigation/child-stack-navigator";
import colors from "colors";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";

const fullHeight = Dimensions.get("window").height;

const GET_CHILD = gql`
  query GetChild($types: [PostType]) {
    childCategories(types: $types) {
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

type ChildFeedNavigationProp = NavigationProp<ChildStackParamList, "childFeed">;

type ChildCategoriesData = {
  childCategories: Types.ICategories;
};

const getCategoryMeta = (index: number) => {
  const rowsMeta = [
    {
      backgroundColor: colors.childCategory1,
      color: colors.primary,
    },
    {
      backgroundColor: colors.childCategory2,
      color: colors.primary,
    },
    {
      backgroundColor: colors.childCategory3,
      color: colors.primary,
    },
  ];
  return rowsMeta[index % rowsMeta.length];
};

const ChildScreen = () => {
  const navigation = useNavigation<ChildFeedNavigationProp>();
  // const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, error } = useQuery<ChildCategoriesData>(GET_CHILD, {
    variables: { types: ["image", "markdown", "video", "inapp"] },
  });

  if (error) {
    errorReport(error, { origin: "child> get feed" });
    return null;
  }

  const categories: Types.ICategory[] = data ? data.childCategories : [];

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View
        style={{
          width: (fullHeight / 3) * 2.2,
          height: (fullHeight / 3) * 2.2,
          position: "absolute",
          right: (-fullHeight / 3) * 1.5,
          top: (fullHeight - (fullHeight / 3) * 2 - 80) / 2,
          borderRadius: fullHeight / 2,
          backgroundColor: colors.backgroundVariant,
        }}
      />
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 6,
          height: fullHeight,
          backgroundColor: colors.background,
        }}
      />
      {loading && <Loading />}
      {categories.map((category, index) => {
        const meta = getCategoryMeta(index);
        return (
          <CategoryTile
            meta={{ index, ...meta }}
            key={category.id}
            category={category}
            onPress={() =>
              navigation.navigate("childFeed", {
                category,
                meta,
              })
            }
          />
        );
      })}
    </View>
  );
};

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingTop: 50,
    paddingRight: 45,
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: "column",
    justifyContent: "space-evenly",
    // alignItems: "center",
  },
  tree: {
    position: "absolute",
    right: (width / 2 - 90) / 2,
    bottom: 30,
    width: 90,
    height: 50,
  },
});

export default ChildScreen;
