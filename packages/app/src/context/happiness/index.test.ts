import { processCategoryExercise, ONE_DAY_IN_MILLISECONDS } from "./index";
import * as types from "types";

it("already unlocked", () => {
  const rawCategory = {
    exercises: [{ id: "1" }, { id: "2" }, { id: "3" }],
  } as types.IHappinessTrainingCategory;

  const exercises = { "1": { state: "unlocked" } } as const;

  const result = processCategoryExercise(
    rawCategory,
    exercises,
    ONE_DAY_IN_MILLISECONDS + 2
  );
  const expectedResult = {
    "2": { state: "locked" },
    "3": { state: "locked" },
  };

  expect(result).toMatchObject(expectedResult);
});

it("done long ago", () => {
  const rawCategory = {
    exercises: [{ id: "1" }, { id: "2" }, { id: "3" }],
  } as types.IHappinessTrainingCategory;
  const exercises = { "1": { state: "done", doneAt: 1 } } as const;

  const result = processCategoryExercise(
    rawCategory,
    exercises,
    ONE_DAY_IN_MILLISECONDS + 2
  );
  const expectedResult = {
    "2": { state: "unlocked" },
    "3": { state: "locked" },
  };

  expect(result).toMatchObject(expectedResult);
});

it("done recently", () => {
  const rawCategory = {
    exercises: [{ id: "1" }, { id: "2" }, { id: "3" }],
  } as types.IHappinessTrainingCategory;
  const exercises = { "1": { state: "done", doneAt: 1 } } as const;

  const result = processCategoryExercise(rawCategory, exercises, 2);
  const expectedResult = {
    "2": { state: "locked" },
    "3": { state: "locked" },
  };

  expect(result).toMatchObject(expectedResult);
});

it("empty case", () => {
  const rawCategory = {
    exercises: [{ id: "1" }, { id: "2" }, { id: "3" }],
  } as types.IHappinessTrainingCategory;
  const exercises = {} as const;

  const result = processCategoryExercise(rawCategory, exercises, 1);
  const expectedResult = {
    "1": { state: "unlocked" },
    "2": { state: "locked" },
    "3": { state: "locked" },
  };

  expect(result).toMatchObject(expectedResult);
});
