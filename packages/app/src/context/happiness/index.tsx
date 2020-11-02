import React, { useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as types from "types";

const EXERCISE_KEY = "happiness_exercises";
const CATEGORY_KEY = "happiness_categories";
const IDEA_KEY = "happiness_ideas";
const SERVER_DATA = "happiness_server";
const ONE_DAY_IN_MILLISECONDS = 1000 * 2 * 1;
// export const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export type State =
  | { state: "locked" | "unlocked" }
  | { state: "done"; doneAt: number };
type ID = string;
type Exercises = Record<ID, State>;
type Categories = Record<ID, State>;
type Ideas = Record<ID, string[]>;

type IHappinessContext = {
  exercises: Exercises;
  categories: Categories;
  ideas: Ideas;
  rawCategories: types.IHappinessTrainingCategory[];
  updateRawCategories: (
    d: types.IHappinessTrainingCategory[] | undefined
  ) => void;
  update: () => void;
  markExerciseAsDone: (id: ID) => void;
  addIdea: (categoryID: ID, text: string) => void;
  isCategoryDone: (category: types.IHappinessTrainingCategory) => boolean;
  categoryToTryNext: () => NextCategory;
  isAllDone: () => boolean;
};

type NextCategory =
  | null
  | "all-done"
  | "not-now"
  | types.IHappinessTrainingCategory;

const HappinessContext = React.createContext<IHappinessContext>({
  exercises: {},
  categories: {},
  ideas: {},
  updateRawCategories: () => {},
  rawCategories: [],
  update: () => {},
  markExerciseAsDone: () => {},
  addIdea: () => {},
  isCategoryDone: () => false,
  categoryToTryNext: () => null,
  isAllDone: () => false,
});

export function isCategoryNotDoneYet(
  rawCategory: types.IHappinessTrainingCategory,
  exercises: Exercises
) {
  const result = rawCategory.exercises.reduce((acc, rawExercise) => {
    const id = rawExercise.id;
    const exercise = exercises[id];
    if (exercise?.state === "unlocked" || exercise?.state === "locked") {
      return true;
    } else {
      return acc;
    }
  }, false);
  return result;
}

export function isCategoryDoneGivenExercises(
  rawCategory: types.IHappinessTrainingCategory,
  exercises: Exercises
) {
  const allDone = rawCategory.exercises.every((rawExercise) => {
    const id = rawExercise.id;
    const exercise = exercises[id];
    return exercise?.state === "done";
  });
  return allDone && rawCategory.exercises.length > 0;
}

function getLastExerciseDoneAt(
  rawCategory: types.IHappinessTrainingCategory,
  exercises: Exercises
): number {
  const result = rawCategory.exercises.reduce((last, { id }) => {
    const exercise = exercises[id];
    if (exercise?.state === "done") {
      return Math.max(last ?? 0, exercise.doneAt);
    }
    return last;
  }, 0);
  return result;
}

export function getNextState(
  rawCategories: types.IHappinessTrainingCategory[],
  exercises: Exercises,
  currentTime: number
) {
  const nextCategories: Categories = {};
  const nextExercises: Exercises = {};

  // exercises are not locked, but first one locked, following are locked too.
  let isExercisesLocked = false;

  // all exercises are done, next category is unlocked.
  // if category is unlocked, next categories are locked.
  let isCategoryLocked = false;

  // c1         c2       ... c6
  // e1 e2 e3   e4 e5 e6 ... e18

  rawCategories.forEach((rawCategory) => {
    const categoryId = rawCategory.id;

    isExercisesLocked = isCategoryLocked;

    const lastExerciseDoneAt = getLastExerciseDoneAt(rawCategory, exercises);
    const isRecent = currentTime - lastExerciseDoneAt < ONE_DAY_IN_MILLISECONDS;
    isExercisesLocked = isExercisesLocked || isRecent;

    rawCategory.exercises.forEach((rawExercise) => {
      const exerciseId = rawExercise.id;
      const exercise = exercises[exerciseId];
      if (exercise) {
        if (exercise.state === "locked" && !isExercisesLocked) {
          nextExercises[exerciseId] = { state: "unlocked" };
          isExercisesLocked = true;
        } else if (exercise.state === "unlocked") {
          isExercisesLocked = true;
        }
      } else {
        if (isExercisesLocked) {
          nextExercises[exerciseId] = { state: "locked" };
        } else {
          nextExercises[exerciseId] = { state: "unlocked" };
          isExercisesLocked = true;
        }
      }
    });

    const categoryIsDone = isCategoryDoneGivenExercises(rawCategory, {
      ...exercises,
      ...nextExercises,
    });
    // isCategoryLocked = isCategoryDone ? false :
    // one ex is unlocked: category is unlocked and next ones should be locked
    // all ex done: category is done and next one should be unlocked
    const categoryIsNotDone = isCategoryNotDoneYet(rawCategory, {
      ...exercises,
      ...nextExercises,
    });

    if (categoryIsDone) {
      nextCategories[categoryId] = {
        state: "done",
        doneAt: lastExerciseDoneAt,
      };
      isCategoryLocked = isRecent ? true : false;
    } else if (categoryIsNotDone && !isCategoryLocked) {
      nextCategories[categoryId] = {
        state: "unlocked",
      };
      isCategoryLocked = true;
    } else {
      nextCategories[categoryId] = {
        state: "locked",
      };
      isCategoryLocked = true;
    }
  });
  return {
    exercises: { ...exercises, ...nextExercises },
    categories: nextCategories,
  };
}

export const HappinessProvider = <T extends {}>(props: T) => {
  const [exercises, setExercises] = React.useState<Exercises>({});
  const [categories, setCategories] = React.useState<Categories>({});
  const [ideas, setIdeas] = React.useState<Ideas>({});
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
  const updateIdeas = async (updated: Ideas) => {
    await AsyncStorage.setItem(IDEA_KEY, JSON.stringify(updated));
    setIdeas(updated);
  };

  const markExerciseAsDone = async (id: ID) => {
    const temp: Exercises = {
      ...exercises,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateExercises(temp);
  };

  const addIdea = async (categoryID: ID, text: string) => {
    const idea = ideas[categoryID] ?? [];
    const temp: Ideas = {
      ...ideas,
      [categoryID]: [...idea, text],
    };
    updateIdeas(temp);
  };

  const updateRawCategories = async (
    _rawCategories: types.IHappinessTrainingCategory[] | undefined
  ) => {
    if (!_rawCategories) {
      return;
    }
    await AsyncStorage.setItem(SERVER_DATA, JSON.stringify(categories));
    setRawCategories(_rawCategories);

    const result = getNextState(_rawCategories, exercises, Date.now());
    updateCategories(result.categories);
    updateExercises(result.exercises);
  };

  useEffect(() => {
    async function readFromStorage() {
      const storedExercises = await AsyncStorage.getItem(EXERCISE_KEY);
      const storedIdeas = await AsyncStorage.getItem(IDEA_KEY);
      try {
        if (storedExercises) {
          setExercises(JSON.parse(storedExercises));
        }
        if (storedIdeas) {
          setIdeas(JSON.parse(storedIdeas));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

  const isCategoryDone = (
    rawCategory: types.IHappinessTrainingCategory
  ): boolean => {
    const result = isCategoryDoneGivenExercises(rawCategory, exercises);
    return result;
  };

  const isAllDone = () => {
    const result = rawCategories.every((rawCategory) =>
      isCategoryDoneGivenExercises(rawCategory, exercises)
    );
    return result;
    // return true;
  };

  const update = () => {
    const result = getNextState(rawCategories, exercises, Date.now());
    updateCategories(result.categories);
    updateExercises(result.exercises);
  };

  const categoryToTryNext = (): NextCategory => {
    return rawCategories.length > 0
      ? [...rawCategories]
          .reverse()
          .reduce(
            (
              acc: "all-done" | "not-now" | types.IHappinessTrainingCategory,
              category: types.IHappinessTrainingCategory
            ) => {
              if (acc !== "not-now" && acc !== "all-done") {
                return acc;
              }
              const state = categories[category.id]?.state;
              if (state === "done" && acc === "all-done") {
                return acc;
              }
              if (categories[category.id]?.state === "unlocked") {
                return category;
              }
              return "not-now";
            },
            "all-done"
          )
      : null;
  };

  return (
    <HappinessContext.Provider
      {...props}
      value={{
        updateRawCategories,
        update,
        exercises,
        ideas,
        categories,
        rawCategories,
        markExerciseAsDone,
        addIdea,
        isCategoryDone,
        categoryToTryNext,
        isAllDone,
      }}
    />
  );
};

export const useHappiness = () => {
  return React.useContext(HappinessContext);
};

// AsyncStorage.setItem(EXERCISE_KEY, JSON.stringify({}));
