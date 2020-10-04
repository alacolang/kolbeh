import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as types from "types";

const EXERCISE_KEY = "happiness_exercises";
const CATEGORY_KEY = "happiness_categories";
const SERVER_DATA = "happiness_server";
export const ONE_DAY_IN_MILLISECONDS = 1000 * 5 * 1;
// export const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const format = (stuff: string | Record<string, any> | null) => {
  if (!stuff) return stuff;
  if (typeof stuff === "string") {
    return JSON.stringify(JSON.parse(stuff), null, 2);
  } else {
    return JSON.stringify(stuff, null, 2);
  }
};

type ID = string;

type Exercises = Record<
  ID,
  { state: "locked" | "unlocked" } | { state: "done"; doneAt: number }
>;
type Categories = Record<
  ID,
  { state: "locked" | "unlocked" } | { state: "done"; doneAt: number }
>;
type IHappinessContext = {
  exercises: Exercises;
  categories: Categories;
  updateRawCategories: (
    d: types.IHappinessTrainingCategory[] | undefined
  ) => void;
  markExerciseAsDone: (id: ID) => void;
  markCategoryAsDone: (id: ID) => void;
  updateCategoryExercises: (category: types.IHappinessTrainingCategory) => void;
  isCategoryDone: (category: types.IHappinessTrainingCategory) => boolean;
};

const HappinessContext = React.createContext<IHappinessContext>({
  exercises: {},
  categories: {},
  updateRawCategories: () => {},
  markExerciseAsDone: () => {},
  markCategoryAsDone: () => {},
  updateCategoryExercises: () => {},
  isCategoryDone: () => false,
});

export function isCategoryDoneGivenExercises(
  rawCategory: types.IHappinessTrainingCategory,
  exercises: Exercises
) {
  const allDone = rawCategory.exercises.reduce((acc, rawExercise) => {
    const id = rawExercise.id;
    const exercise = exercises[id];
    if (exercise?.state !== "done") {
      return false;
    } else {
      return acc;
    }
  }, true);
  return allDone && rawCategory.exercises.length > 0;
}

export function processCategories(
  rawCategories: types.IHappinessTrainingCategory[],
  categories: Categories,
  currentTime: number
) {
  const result: any = {};
  let canTry = rawCategories.reduce((acc, rawCategory) => {
    const id = rawCategory.id;
    const category = categories[id];
    if (
      category?.state === "unlocked" ||
      (category?.state === "done" &&
        currentTime - category.doneAt < ONE_DAY_IN_MILLISECONDS)
    ) {
      return false;
    }
    return acc;
  }, true);

  rawCategories.forEach((rawCategory) => {
    const id = rawCategory.id;
    const areThereExercises = rawCategory.exercises.length > 0;
    if (!areThereExercises) {
      result[id] = { state: "locked" };
      return;
    }
    const category = categories[id];
    if (!category) {
      let state = "locked";
      if (canTry) {
        state = "unlocked";
        canTry = false;
      }
      result[id] = { state };
    } else {
      if (canTry && category.state === "locked") {
        result[id] = { state: "unlocked" };
        canTry = false;
      }
    }
  });
  return result;
}

export function processCategoryExercise(
  rawCategory: types.IHappinessTrainingCategory,
  exercises: Exercises,
  currentTime: number
) {
  const result: any = {};

  let canTry = rawCategory.exercises.reduce((acc, rawExercise) => {
    const id = rawExercise.id;
    const exercise = exercises[id];
    if (
      exercise?.state === "unlocked" ||
      (exercise?.state === "done" &&
        currentTime - exercise.doneAt < ONE_DAY_IN_MILLISECONDS)
    ) {
      return false;
    }
    return acc;
  }, true);

  rawCategory.exercises.forEach((rawExercise) => {
    const id = rawExercise.id;
    const exercise = exercises[id];
    if (!exercise) {
      let state = "locked";
      if (canTry) {
        state = "unlocked";
        canTry = false;
      }
      result[id] = { state };
    } else {
      if (canTry && exercise.state === "locked") {
        result[id] = { state: "unlocked" };
        canTry = false;
      }
    }
  });
  return result;
}

export const HappinessProvider = <T extends {}>(props: T) => {
  const [exercises, setExercises] = React.useState<Exercises>({});
  const [categories, setCategories] = React.useState<Categories>({});
  const [rawCategories, setRawCategories] = React.useState<
    types.IHappinessTrainingCategory[]
  >([]);

  const updateExercises = async (updated: Exercises) => {
    await AsyncStorage.setItem(EXERCISE_KEY, JSON.stringify(updated));
    setExercises(updated);
  };
  const updateCategories = async (updated: Categories) => {
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(updated));
    setCategories(updated);
  };

  const markExerciseAsDone = async (id: ID) => {
    const temp: Exercises = {
      ...exercises,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateExercises(temp);
  };

  const markCategoryAsDone = async (id: ID) => {
    const temp: Categories = {
      ...categories,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateCategories(temp);
  };

  const markCategoryAsNotDone = async (id: ID) => {
    const state = categories[id]?.state;
    const temp: Categories = {
      ...categories,
      [id]: { state: state === "done" ? "unlocked" : state },
    };
    console.log("markCategoryAsNotDone", { id, temp });
    updateCategories(temp);
  };

  const updateRawCategories = async (
    _rawCategories: types.IHappinessTrainingCategory[] | undefined
  ) => {
    console.log("updateRawCategories", _rawCategories);
    if (!_rawCategories) return;
    await AsyncStorage.setItem(SERVER_DATA, JSON.stringify(categories));
    setRawCategories(_rawCategories);

    const result = processCategories(_rawCategories, categories, Date.now());
    console.log("updateRawCategories", { result });
    updateCategories({ ...categories, ...result });
  };

  const updateCategoryExercises = (
    rawCategory: types.IHappinessTrainingCategory
  ) => {
    console.log("updateCategoryExercises>", { rawCategory, categories });
    if (rawCategory.exercises?.length === 0) {
      return;
    }

    // if (categories[rawCategory.id].state === "done") {
    //   return;
    // }
    const isAllDone = isCategoryDoneGivenExercises(rawCategory, exercises);
    if (isAllDone) {
      markCategoryAsDone(rawCategory.id);
      return {};
    } else {
      markCategoryAsNotDone(rawCategory.id);
    }
    const result = processCategoryExercise(rawCategory, exercises, Date.now());
    // console.log("updateCategoryExercises", result);
    updateExercises({ ...exercises, ...result });
  };

  React.useEffect(() => {
    async function readFromStorage() {
      const storedExercise = await AsyncStorage.getItem(EXERCISE_KEY);
      const storedCategory = await AsyncStorage.getItem(CATEGORY_KEY);
      console.log("stored exercise:", format(storedExercise));
      try {
        if (storedExercise) {
          setExercises(JSON.parse(storedExercise));
        }
        if (storedCategory) {
          setCategories(JSON.parse(storedCategory));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

  const isCategoryDone = (
    rawCategory: types.IHappinessTrainingCategory
  ): boolean => {
    const result = isCategoryDoneGivenExercises(rawCategory, exercises);
    console.log("isCategoryDone", result);
    return result;
  };

  return (
    <HappinessContext.Provider
      {...props}
      value={{
        updateRawCategories,
        exercises,
        categories,
        markExerciseAsDone,
        markCategoryAsDone,
        updateCategoryExercises,
        isCategoryDone,
      }}
    />
  );
};

export const useHappiness = () => {
  return React.useContext(HappinessContext);
};
