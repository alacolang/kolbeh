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

const sum = (arr: number[]): number => {
  return arr.reduce((acc, element) => {
    return acc + element;
  }, 0);
};

export const didExerciseThisManyTimes = (users: User[]) => (
  howManyTimes: number
): number => {
  return users
    .map((user) =>
      sum(
        happinessTrainingData.categories.map((category) => {
          return category.exercises.filter(
            (exercise) =>
              user.happiness?.exercises[exercise.id].state === "done"
          ).length;
        })
      )
    )
    .filter(
      (userTotalNumberExercisesDone) =>
        userTotalNumberExercisesDone === howManyTimes
    ).length;
};

const isLastWeek = (time: number): boolean => {
  const diff = differenceInDays(new Date(), time);
  return diff > 7 && diff <= 14;
};

const totalTimesUserDidExerciseLastWeek = (users: User[]): number[] => {
  return users.map((user) =>
    sum(
      happinessTrainingData.categories.map((category) => {
        return category.exercises.filter((exercise) => {
          const exerciseState = user.happiness?.exercises[exercise.id];
          if (exerciseState?.state !== "done") {
            return false;
          }
          return isLastWeek(exerciseState.doneAt);
        }).length;
      })
    )
  );
};

export const howManyUsersDidExerciseLastWeek = (users: User[]): number => {
  return totalTimesUserDidExerciseLastWeek(users).filter((x) => x > 0).length;
};

export const howManyExcercisesUsersDidLastWeek = (users: User[]): number => {
  return sum(totalTimesUserDidExerciseLastWeek(users));
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
});

export default statsRouter;
