import React from "react";
import {
  RefreshControl,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import CategoryTile from "./category-tile";
import Loading from "../../components/loading";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import colors from "../../colors";
import * as Types from "../../types";
import { errorReport } from "../../utils/error-reporter";

const GET_PARENT = gql`
  query GetParent {
    parentCategories {
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

type ParentFeedNavigationProp = NavigationProp<
  ParentStackParamList,
  "parentFeed"
>;

type ParentCategoriesData = {
  parentCategories: Types.ICategories;
};

const ParentScreen = () => {
  const navigation = useNavigation<ParentFeedNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, loading, refetch, error } = useQuery<ParentCategoriesData>(
    GET_PARENT
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

  const categories: Types.ICategory[] = data ? data.parentCategories : [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {categories.map((category, index) => (
        <CategoryTile
          key={category.id}
          category={category}
          onPress={() => navigation.navigate("parentFeed", category)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: 30,
  },
});

export default ParentScreen;
