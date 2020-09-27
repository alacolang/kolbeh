import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as types from "types";

const EXERCISE_KEY = "happiness_exercises";
const CATEGORY_KEY = "happiness_exercises";
const SERVER_DATA = "happiness_server";
export const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

type ID = string;

type Exercises = Record<
  ID,
  | { state: "in-progress" | "locked" | "unlocked" }
  | { state: "done"; doneAt: number }
>;
type Categories = Record<
  ID,
  | { state: "in-progress" | "locked" | "unlocked" }
  | { state: "done"; doneAt: number }
>;
type IHappinessContext = {
  exercises: Exercises;
  categories: Categories;
  updateRawCategories: (d: types.IHappinessTrainingCategory[]) => void;
  markExerciseAsDone: (id: ID) => void;
  markCategoryAsDone: (id: ID) => void;
  updateCategoryExercises: (category: types.IHappinessTrainingCategory) => void;
};

const HappinessContext = React.createContext<IHappinessContext>({
  exercises: {},
  categories: {},
  updateRawCategories: () => {},
  markExerciseAsDone: () => {},
  markCategoryAsDone: () => {},
  updateCategoryExercises: () => {},
});

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
      exercise?.state === "in-progress" ||
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
    console.log('updateCategories', {updated});
    setCategories(updated);
  };

  const markExerciseAsDone = async (id: ID) => {
    const temp: Exercises = {
      ...exercises,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateExercises(temp);
    setExercises(temp);
  };

  const markCategoryAsDone = async (id: ID) => {
    const temp: Categories = {
      ...categories,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateCategories(temp);
    setCategories(temp);
  };

  const updateRawCategories = async (
    rawCategories: types.IHappinessTrainingCategory[]
  ) => {
    console.log("updateRawCategories", rawCategories);
    await AsyncStorage.setItem(SERVER_DATA, JSON.stringify(categories));
    setRawCategories(rawCategories);
    if (Object.keys(categories).length === 0) {
      updateCategories({
        ...categories,
        [rawCategories[0].id]: { state: "unlocked" },
      });
    }
  };

  const updateCategoryExercises = (
    rawCategory: types.IHappinessTrainingCategory
  ) => {
    const result = processCategoryExercise(rawCategory, exercises, Date.now());
    // console.log("updateCategoryExercises", result);
    updateExercises({ ...exercises, ...result });
  };

  React.useEffect(() => {
    async function readFromStorage() {
      const rawExercise = await AsyncStorage.getItem(EXERCISE_KEY);
      const rawCategory = await AsyncStorage.getItem(CATEGORY_KEY);
      try {
        if (rawExercise) {
          setExercises(JSON.parse(rawExercise));
        }
        if (rawCategory) {
          setCategories(JSON.parse(rawCategory));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

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
      }}
    />
  );
};

export const useHappiness = () => {
  return React.useContext(HappinessContext);
};
