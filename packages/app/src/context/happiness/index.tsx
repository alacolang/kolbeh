import React, { useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import * as types from "types";
import { sync } from "../sync";
import * as storage from "../../utils/storage";
import { differenceInSeconds, differenceInCalendarDays } from "date-fns";
import config from "config";

const DEV_MODE_NEXT_EXERCISE_IN_SECONDS = 2000;
const EXERCISE_KEY = "happiness_exercises";
const CATEGORY_KEY = "happiness_categories";
const IDEA_KEY = "happiness_ideas";
const SERVER_DATA_KEY = "happiness_server";
const REMINDER_KEY = "happiness_reminder";
const REMINDER_INITIAL_STATE: ReminderState = {
  state: "INACTIVE",
};

export async function readFromStorage() {
  const exercises = await storage.get<Exercises>(EXERCISE_KEY);
  const ideas = await storage.get<Ideas>(IDEA_KEY);
  const rawCategories = await storage.get<types.IHappinessTrainingCategory[]>(
    SERVER_DATA_KEY
  );
  const reminder = await storage.get<ReminderState>(REMINDER_KEY);
  return { exercises, ideas, rawCategories, reminder };
}

function isExerciseDoneRecently(
  currentTime: number,
  lastExerciseDoneAt: number
) {
  if (config.isDevelopment) {
    return (
      differenceInSeconds(currentTime, lastExerciseDoneAt) <
      DEV_MODE_NEXT_EXERCISE_IN_SECONDS
    );
  } else {
    return differenceInCalendarDays(currentTime, lastExerciseDoneAt) < 1;
  }
}

export type State =
  | { state: "locked" | "unlocked" }
  | { state: "done"; doneAt: number };
type ID = string;
export type Exercises = Record<ID, State>;
export type Categories = Record<ID, State>;
type Ideas = Record<ID, string[]>;
export type ReminderState = {
  state: "ACTIVE" | "INACTIVE";
};

export type IHappinessContext = {
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
  getCategoryToTryNext: () => NextCategory;
  isAllDone: () => boolean;
  reminderState: ReminderState;
  updateReminder: (s: ReminderState) => void;
};

export type NextCategory =
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
  getCategoryToTryNext: () => null,
  isAllDone: () => false,
  reminderState: REMINDER_INITIAL_STATE,
  updateReminder: () => {},
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

function _sync(exercises: Exercises, reminder: ReminderState) {
  sync({ happiness: { exercises, reminder } });
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

export function getCategoryToTryNext(
  categories: Categories,
  rawCategories: types.IHappinessTrainingCategory[]
): NextCategory {
  if (
    !rawCategories ||
    rawCategories.length === 0 ||
    !categories ||
    Object.keys(categories).length === 0
  ) {
    return null;
  }
  return [...rawCategories]
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
    );
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
    const isRecent = isExerciseDoneRecently(currentTime, lastExerciseDoneAt);
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

type InitialData = {
  exercises: Exercises;
  categories: Categories;
  ideas: Ideas;
  rawCategories: types.IHappinessTrainingCategory[];
  reminder: ReminderState;
};

export const HappinessProvider = (props: {
  children: React.ReactNode;
  initialData: InitialData;
}) => {
  const [exercises, setExercises] = React.useState<Exercises>(
    props.initialData.exercises ?? {}
  );
  const [categories, setCategories] = React.useState<Categories>(
    props.initialData.categories ?? {}
  );
  const [ideas, setIdeas] = React.useState<Ideas>(
    props.initialData.ideas ?? {}
  );
  const [reminder, setReminder] = React.useState<ReminderState>(
    props.initialData.reminder ?? REMINDER_INITIAL_STATE
  );
  const [rawCategories, setRawCategories] = React.useState<
    types.IHappinessTrainingCategory[]
  >(props.initialData.rawCategories ?? []);

  const updateExercises = async (updated: Exercises) => {
    setExercises(updated);
    storage.update(EXERCISE_KEY, updated);
  };
  const updateCategories = async (updated: Categories) => {
    setCategories(updated);
    storage.update(CATEGORY_KEY, updated);
  };
  const updateIdeas = async (updated: Ideas) => {
    setIdeas(updated);
    storage.set(IDEA_KEY, updated);
  };

  const markExerciseAsDone = async (id: ID) => {
    const temp: Exercises = {
      ...exercises,
      [id]: { state: "done", doneAt: Date.now() },
    };
    updateExercises(temp);
    try {
      _sync(temp, reminder);
    } catch (e) {
      console.warn("happiness> failed to sync", e);
    }
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
    setRawCategories(_rawCategories);
    AsyncStorage.setItem(SERVER_DATA_KEY, JSON.stringify(_rawCategories));

    const result = getNextState(_rawCategories, exercises, Date.now());
    updateCategories(result.categories);
    updateExercises(result.exercises);
  };

  useEffect(() => {
    update(props.initialData.rawCategories ?? [], props.initialData.exercises);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   async function readFromStorage() {
  //     const storedExercises = await storage.get<Exercises>(EXERCISE_KEY);
  //     const storedIdeas = await storage.get<Ideas>(IDEA_KEY);
  //     const storedRawCategories = await storage.get<
  //       types.IHappinessTrainingCategory[]
  //     >(SERVER_DATA_KEY);
  //     const storedReminder = await storage.get<ReminderState>(REMINDER_KEY);
  //     try {
  //       if (storedIdeas) {
  //         setIdeas(storedIdeas);
  //       }
  //       if (storedRawCategories) {
  //         setRawCategories(storedRawCategories);
  //       }
  //       if (storedExercises) {
  //         setExercises(storedExercises);
  //         update(storedRawCategories ?? [], storedExercises);
  //       }
  //       if (storedReminder) {
  //         setReminder(storedReminder);
  //       }
  //     } catch (e) {
  //       console.warn("failed to load", e);
  //     }
  //   }
  //   readFromStorage();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  const update = (r = rawCategories, e = exercises) => {
    // console.log("h2", { exercises });
    const result = getNextState(r, e, Date.now());
    updateCategories(result.categories);
    updateExercises(result.exercises);
  };

  const updateReminder = (state: ReminderState) => {
    AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(state));
    setReminder(state);
    _sync(exercises, state);
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
        reminderState: reminder,
        updateReminder,
        getCategoryToTryNext: () =>
          getCategoryToTryNext(categories, rawCategories),
        isAllDone,
      }}
    />
  );
};

export const useHappiness = () => {
  return React.useContext(HappinessContext);
};

// AsyncStorage.setItem(EXERCISE_KEY, JSON.stringify({}));
// AsyncStorage.setItem(SERVER_DATA_KEY, JSON.stringify([]));
