import React from "react";
import { Dimensions, Image, StatusBar, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import LinearGradient from "react-native-linear-gradient";
import CategoryTile from "./category-tile";
import Loading from "../../components/loading";
import { ChildStackParamList } from "../../navigation/child-stack-navigator";
import colors from "../../colors";
import * as Types from "../../types";
import { errorReport } from "../../utils/error-reporter";
import cloudImg from "../../assets/images/cloud.png";
import treeImg from "../../assets/images/tree.png";
import cloudBlueImg from "../../assets/images/cloud-blue.png";
import cloudYellowImg from "../../assets/images/cloud-yellow.png";

const GET_CHILD = gql`
  query GetChild {
    childCategories {
      id
      title
      icon
      feed {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            title
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
      image: cloudYellowImg,
      backgroundColor: colors.childCategory1,
      color: colors.primary,
    },
    {
      image: cloudBlueImg,
      backgroundColor: colors.childCategory2,
      color: 'white',
    },
  ];
  return rowsMeta[index % rowsMeta.length];
};

const ChildScreen = () => {
  const navigation = useNavigation<ChildFeedNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, refetch, error } = useQuery<ChildCategoriesData>(
    GET_CHILD
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refreshing]);

  if (error) {
    errorReport(error, { origin: "parent> get feed" });
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  const categories: Types.ICategory[] = data ? data.childCategories : [];

  return (
    <LinearGradient
      start={{ x: -0.5, y: -0.5 }}
      end={{ x: 1, y: 1.0 }}
      colors={["#FFFFFF", "#ABDDD2"]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
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
      <Image source={cloudImg} style={styles.cloud1} resizeMode="stretch" />
      <Image source={cloudImg} style={styles.cloud2} resizeMode="stretch" />
      <Image source={treeImg} style={styles.tree} resizeMode="stretch" />
    </LinearGradient>
  );
};

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cloud1: {
    position: "absolute",
    left: 30,
    top: width / 2.5 / 2,
    width: 120,
    height: 40,
  },
  cloud2: {
    position: "absolute",
    right: 30,
    top: width / 2.5 / 2 + 30,
    width: 90,
    height: 30,
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
