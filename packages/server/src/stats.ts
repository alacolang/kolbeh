import { isYesterday, differenceInDays } from "date-fns";
import express from "express";
import { findAll, User } from "./db";
import happinessTrainingData from "./resolvers/data/happinessTraining";

const statsRouter = express.Router();

export const triedAppYesterday = (users: User[]): number => {
  return users.reduce((acc, user) => {
    return acc + (isYesterday(user.modifiedAt) ? 1 : 0);
  }, 0);
};

export const userStatsPerCategory = (users: User[]): number[] => {
  return users
    .map((user) =>
      happinessTrainingData.categories.map((category) => {
        return category.exercises.every(
          (exercise) => user.happiness?.exercises[exercise.id].state === "done"
        );
      })
    )
    .reduce((acc, arr) => {
      return acc.map((element, index) => element + (arr[index] ? 1 : 0));
    }, Array(10).fill(0));
};

export const triedThisWeek = (users: User[]): number => {
  return users.filter(
    (user) => differenceInDays(new Date(), user.modifiedAt) <= 7
  ).length;
};

export const didExerciseThisManyTimes = (users: User[]) => (
  howManyTimes: number
): number => {
  return users
    .map((user) =>
      happinessTrainingData.categories
        .map((category) => {
          return category.exercises.filter(
            (exercise) =>
              user.happiness?.exercises[exercise.id].state === "done"
          ).length;
        })
        .reduce((acc, numberOfExerciseDonePerCat) => {
          return acc + numberOfExerciseDonePerCat;
        }, 0)
    )
    .reduce((acc, userTotalNumberExercisesDone) => {
      return acc + (userTotalNumberExercisesDone === howManyTimes ? 1 : 0);
    }, 0);
};

export const howManyUsersDidExerciseLastWeek = (users: User[]): number => {
  return users
    .map((user) =>
      happinessTrainingData.categories
        .map((category) => {
          return category.exercises.filter((exercise): number => {
            const exerciseState = user.happiness?.exercises[exercise.id];
            let exerciseDoneTime = 0;
            if (exerciseState?.state === "done") {
              exerciseDoneTime = exerciseState.doneAt;
            }
            const didExerciseLastWeek =
              differenceInDays(new Date(), exerciseDoneTime) > 7 &&
              differenceInDays(new Date(), exerciseDoneTime) <= 14
                ? 1
                : 0;
            return didExerciseLastWeek;
          }).length;
        })
        .reduce((acc, TimesDidExerciseLastWeek): number => {
          return acc + TimesDidExerciseLastWeek;
        }, 0)
    )
    .reduce((acc, TotalTimesUserDidExerciseLastWeek) => {
      return acc + (TotalTimesUserDidExerciseLastWeek > 0 ? 1 : 0);
    }, 0);
};

export const howManyExcercisesUsersDidLastWeek = (users: User[]): number => {
  return users
    .map((user) =>
      happinessTrainingData.categories
        .map((category) => {
          return category.exercises.filter((exercise): number => {
            const exerciseState = user.happiness?.exercises[exercise.id];
            let exerciseDoneTime = 0;
            if (exerciseState?.state === "done") {
              exerciseDoneTime = exerciseState.doneAt;
            }
            const didExerciseLastWeek =
              differenceInDays(new Date(), exerciseDoneTime) > 7 &&
              differenceInDays(new Date(), exerciseDoneTime) <= 14
                ? 1
                : 0;
            return didExerciseLastWeek;
          }).length;
        })
        .reduce((acc, TimesDidExerciseLastWeek): number => {
          return acc + TimesDidExerciseLastWeek;
        }, 0)
    )
    .reduce((acc, TotalTimesUserDidExerciseLastWeek) => {
      return acc + TotalTimesUserDidExerciseLastWeek;
    }, 0);
};

statsRouter.get("/", (req, res) => {
  findAll().then((users) => {
    res.json({
      triedAppYesterday: triedAppYesterday(users),
      userStatsPerCategory: userStatsPerCategory(users),
      hasNotDoneAnyExercises: didExerciseThisManyTimes(users)(0),
      didExerciseExactlyOnce: didExerciseThisManyTimes(users)(1),
      didExerciseExactlyTwice: didExerciseThisManyTimes(users)(2),
      didExerciseExactlyThreeTimes: didExerciseThisManyTimes(users)(3),
      howManyUsersDidExerciseLastWeek: howManyUsersDidExerciseLastWeek(users),
      howManyExcercisesUsersDidLastWeek: howManyExcercisesUsersDidLastWeek(
        users
      ),
    });
  });
  // res.json({ status: "ok" });
});

export default statsRouter;
