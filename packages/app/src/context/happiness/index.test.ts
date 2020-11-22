import { getNextState } from "./index";
import * as types from "types";

describe("categories", () => {
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
});

// describe("next category to try", () => {
//   it("when data is ready", () => {
//     const rawCategories = [
//       { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
//       { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
//     ] as types.IHappinessTrainingCategory[];

//     const categories = {
//       "cat-1": {
//         state: "done",
//         doneAt: 10,
//       },
//       "cat-2": {
//         state: "unlocked",
//       },
//     } as const;
//     const next = getCategoryToTryNext(categories, rawCategories);
//     // @ts-expect-error
//     expect(next?.id).toEqual("cat-2");
//   });
//   it("when only rawCategories there", () => {
//     const rawCategories = [
//       { id: "cat-1", exercises: [{ id: "cat-1-ex-1" }, { id: "cat-1-ex-2" }] },
//       { id: "cat-2", exercises: [{ id: "cat-2-ex-1" }, { id: "cat-2-ex-2" }] },
//     ] as types.IHappinessTrainingCategory[];
//     const categories = {} as const;
//     const next = getCategoryToTryNext(categories, rawCategories);
//     expect(next).toEqual(null);
//   });
//   it("when not rawCategories there", () => {
//     const rawCategories = [] as types.IHappinessTrainingCategory[];
//     const categories = {} as const;
//     const next = getCategoryToTryNext(categories, rawCategories);
//     expect(next).toEqual(null);
//   });
// });
