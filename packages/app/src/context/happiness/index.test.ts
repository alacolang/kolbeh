import {
  getNextState,
  getCategoryToTryNext,
  DEV_MODE_NEXT_EXERCISE_IN_SECONDS,
} from "./index";
import * as types from "types";

const yesterday = Date.now();
const NEXT_MS = DEV_MODE_NEXT_EXERCISE_IN_SECONDS * 1000;
const today = NEXT_MS / 2 + yesterday + 10;
const tomorrow = yesterday + NEXT_MS * 2 + 10;

describe("happiness categories", () => {
  it("empty case", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const result = getNextState(rawCategories, {}, Date.now());
    const expectedResult = {
      categories: {
        "cat-1": {
          state: "unlocked",
        },
        "cat-2": {
          state: "locked",
        },
      },
      exercises: {
        "cat-1-ex-1": { state: "unlocked" },
        "cat-1-ex-2": { state: "locked" },
        "cat-2-ex-1": { state: "locked" },
        "cat-2-ex-2": { state: "locked" },
      },
    };
    expect(result).toEqual(expectedResult);
  });

  it("new category + exercise introduced", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
      { id: "cat-3", exercises: [] },
    ] as types.IHappinessTrainingCategory[];
    const exercises = {
      "cat-1-ex-1": { state: "locked" },
      "cat-1-ex-2": { state: "locked" },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const result = getNextState(rawCategories, exercises, Date.now());

    const expectedResult = {
      categories: {
        "cat-1": {
          state: "unlocked",
        },
        "cat-2": {
          state: "locked",
        },
        "cat-3": {
          state: "locked",
        },
      },
      exercises: {
        ...exercises,
        "cat-1-ex-1": { state: "unlocked" },
      },
    };
    expect(result).toEqual(expectedResult);
  });

  it("no change", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "unlocked" },
      "cat-1-ex-2": { state: "locked" },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const result = getNextState(rawCategories, exercises, Date.now());
    const expectedResult = {
      categories: {
        "cat-1": {
          state: "unlocked",
        },
        "cat-2": {
          state: "locked",
        },
      },
      exercises,
    };

    expect(result).toEqual(expectedResult);
  });

  it("recent exercise done", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: 1 },
      "cat-1-ex-2": { state: "locked" },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const result = getNextState(rawCategories, exercises, 2);
    const expectedResult = {
      categories: {
        "cat-1": {
          state: "unlocked",
        },
        "cat-2": {
          state: "locked",
        },
      },
      exercises,
    };

    expect(result).toEqual(expectedResult);
  });

  it("recent category done", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: 1 },
      "cat-1-ex-2": { state: "done", doneAt: 10 },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const result = getNextState(rawCategories, exercises, 12);
    const expectedResult = {
      categories: {
        "cat-1": {
          state: "done",
          doneAt: 10,
        },
        "cat-2": {
          state: "locked",
        },
      },
      exercises,
    };

    expect(result).toEqual(expectedResult);
  });

  it("mark category as done, unlock next one", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: 1 },
      "cat-1-ex-2": { state: "done", doneAt: 10 },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const result = getNextState(rawCategories, exercises, Date.now());
    const expectedResult = {
      categories: {
        "cat-1": {
          state: "done",
          doneAt: 10,
        },
        "cat-2": {
          state: "unlocked",
        },
      },
      exercises: {
        ...exercises,
        "cat-2-ex-1": { state: "unlocked" },
      },
    };

    expect(result).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> on same day should be not-now", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: today },
      "cat-1-ex-2": { state: "locked" },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const sameDay = today + 10;
    const nextCategory = getCategoryToTryNext(
      rawCategories,
      exercises,
      sameDay
    );
    const expectedResult = {
      state: "not-now",
      nextCategory: rawCategories[0],
      nextExercises: exercises,
    };
    expect(nextCategory).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> on same day should be not-now - second case", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: yesterday },
      "cat-1-ex-2": { state: "done", doneAt: today },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const sameDay = today + 10;
    const nextCategory = getCategoryToTryNext(
      rawCategories,
      exercises,
      sameDay
    );
    const expectedResult = {
      state: "not-now",
      nextCategory: rawCategories[0],
      nextExercises: exercises,
    };
    expect(nextCategory).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> initially should be can-try", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {};
    const nextCategory = getCategoryToTryNext(
      rawCategories,
      exercises,
      tomorrow
    );
    const expectedResult = {
      state: "can-try",
      nextCategory: rawCategories[0],
      nextExercises: {
        "cat-1-ex-1": { state: "unlocked" },
        "cat-1-ex-2": { state: "locked" },
        "cat-2-ex-1": { state: "locked" },
        "cat-2-ex-2": { state: "locked" },
      },
    };
    expect(nextCategory).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> tomorrow should be can-try", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: yesterday },
      "cat-1-ex-2": {
        state: "done",
        doneAt: today,
      },
      "cat-2-ex-1": { state: "locked" },
      "cat-2-ex-2": { state: "locked" },
    } as const;
    const nextCategory = getCategoryToTryNext(
      rawCategories,
      exercises,
      tomorrow
    );
    const expectedResult = {
      state: "can-try",
      nextCategory: rawCategories[1],
      nextExercises: { ...exercises, "cat-2-ex-1": { state: "unlocked" } },
    };
    expect(nextCategory).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> if all done, should be all-done", () => {
    const rawCategories = [
      { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
      { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
    ] as types.IHappinessTrainingCategory[];

    const exercises = {
      "cat-1-ex-1": { state: "done", doneAt: yesterday },
      "cat-1-ex-2": {
        state: "done",
        doneAt: today,
      },
      "cat-2-ex-1": { state: "done", doneAt: today },
      "cat-2-ex-2": { state: "done", doneAt: today },
    } as const;
    const sameDay = today + 100;
    const nextCategory = getCategoryToTryNext(
      rawCategories,
      exercises,
      sameDay
    );
    const expectedResult = {
      state: "all-done",
      nextCategory: rawCategories[1],
      nextExercises: exercises,
    };
    expect(nextCategory).toEqual(expectedResult);
  });

  it("getCategoryToTryNext> if no rawCategories, should return undefined", () => {
    const rawCategories = [] as types.IHappinessTrainingCategory[];
    const next = getCategoryToTryNext(rawCategories, {}, today);
    expect(next).toEqual(undefined);
  });
});
