import React from "react";
import {
  StatusBar,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import CategoryTile from "./category-tile";
import Loading from "../../components/loading";
import { ChildStackParamList } from "../../navigation/child-stack-navigator";
import colors from "../../colors";
import * as Types from "../../types";
import { errorReport } from "../../utils/error-reporter";

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
          onPress={() => navigation.navigate("childFeed", category)}
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

export default ChildScreen;
