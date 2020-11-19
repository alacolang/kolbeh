import { useQuery } from "@apollo/react-hooks";
import { useFocusEffect } from "@react-navigation/native";
import { useConnectivity } from "context/connectivity";
import { useHappiness } from "context/happiness";
import gql from "graphql-tag";
import { useCallback, useEffect } from "react";
import { InteractionManager } from "react-native";
import * as Types from "types";

type HappinessTrainingData = {
  happinessTraining: Types.IHappinessTraining;
};

const GET_HAPPINESS_TRAININGS = gql`
  query {
    happinessTraining {
      categories {
        id
        title
        description
        about
        image {
          url
        }
        exercises {
          id
          title
          description
        }
      }
    }
  }
`;

export function useData() {
  const happiness = useHappiness();
  const { data, loading, error, refetch, networkStatus } = useQuery<
    HappinessTrainingData
  >(GET_HAPPINESS_TRAININGS, {
    // fetchPolicy: "network-only",
    fetchPolicy: "cache-first",
  });

  const newCategories = data?.happinessTraining.categories ?? [];
  const rawCategories = happiness.rawCategories;
  const categoryToTryNext = happiness.getCategoryToTryNext();

  console.log({
    newCategories: newCategories?.length,
    rawCategories: rawCategories?.length,
    categoryToTryNext: categoryToTryNext?.title,
    loading,
  });

  useFocusEffect(
    useCallback(() => {
      if (!rawCategories) {
        refetch();
      }
    }, [rawCategories, refetch])
  );

  const { isConnected } = useConnectivity();

  const _refetch = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      if (refetch) {
        await refetch();
      }
    });
    return () => task.cancel();
  }, [refetch]);

  useEffect(() => {
    if (rawCategories.length === 0 && isConnected) {
      _refetch();
    }
  }, [isConnected, _refetch, rawCategories.length]);

  useEffect(() => {
    if (newCategories.length === 0) {
      return;
    }
    happiness.updateRawCategories(newCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategories]);

  return {
    loading,
    error,
    networkStatus,
    categoryToTryNext,
    categories: happiness.categories,
    rawCategories,
  };
}
