import * as types from "./types";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInMinutes from "date-fns/differenceInMinutes";
import config from "./config";

const DEV_MODE_NEXT_EXERCISE_IN_MINUTES = 2;

export function isExerciseDoneRecently(
  currentTime: number,
  lastExerciseDoneAt: number
): boolean {
  if (config.isDevelopment || config.isStaging) {
    return (
      differenceInMinutes(currentTime, lastExerciseDoneAt) <
      DEV_MODE_NEXT_EXERCISE_IN_MINUTES
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
type Categories = Record<ID, State>;
export type ReminderState = {
  state: "ACTIVE" | "INACTIVE";
};

type NextCategory =
  | null
  | "all-done"
  | "not-now"
  | types.IHappinessTrainingCategory;

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
): { exercises: Exercises; categories: Categories } {
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
