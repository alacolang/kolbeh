import React, { useCallback, useEffect } from "react";
import {
  View,
  RefreshControl,
  StatusBar,
  StyleSheet,
  ScrollView,
  InteractionManager,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import CategoryTile from "./category-tile";
import Loading from "components/loading";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import colors from "colors";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";
import { FormattedText } from "components/formatted-text";
import { useConnectivity } from "context/connectivity";
import { NetworkStatus } from "apollo-client";

const GET_PARENT = gql`
  query GetParent {
    parentCategories {
      id
      title
      shortDescription
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
            markdown {
              content
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
  const { data, loading, refetch, error, networkStatus } = useQuery<
    ParentCategoriesData
  >(GET_PARENT, {
    notifyOnNetworkStatusChange: true,
  });
  const { isConnected } = useConnectivity();

  const _refetch = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      if (refetch) {
        await refetch();
      }
    });
    return () => task.cancel();
  }, [refetch]);

  const categories: Types.ICategory[] = data?.parentCategories ?? [];

  // useEffect(() => {
  //   if (categories.length === 0) {
  //     _refetch();
  //   }
  // }, [isConnected, _refetch, categories.length]);

  console.log(
    { isConnected, networkStatus, loading, error },
    error?.networkError
  );

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <StatusBar hidden />

      {loading && categories.length === 0 ? <Loading varient /> : null}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={_refetch}
          />
        }
      >
        {categories.length === 0 && error ? (
          <View
            style={{
              // position: "absolute",
              // top: 0,
              zIndex: 10,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 36,
              backgroundColor: "#ffffffa0",
              width: "100%",
            }}
          >
            {networkStatus === NetworkStatus.error ? (
              <FormattedText
                id="error.connection"
                style={{ color: colors.primary }}
              />
            ) : (
              <FormattedText
                id="error.misc"
                style={{ color: colors.primary }}
              />
            )}
          </View>
        ) : (
          categories.map((category) => {
            return (
              <CategoryTile
                key={category.id}
                category={category}
                onPress={() => navigation.navigate("parentFeed", { category })}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    paddingTop: 60,
  },
});

export default ParentScreen;
