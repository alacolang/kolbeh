import ClapImg from "../../assets/images/clap.png";
import SnapImg from "../../assets/images/snap.png";
import PatImg from "../../assets/images/pat.png";
import StompImg from "../../assets/images/stomp.png";
// import ClapImg from "../../assets/images/clapping.png";
// import SnapImg from "../../assets/images/snapping.png";
// import PatImg from "../../assets/images/patting.png";
// import StompImg from "../../assets/images/stomping.png";

export const resources = {
  clap: { image: ClapImg, sound: "clap.wav", title: "دست زدن" },
  snap: { image: SnapImg, sound: "snap.wav", title: "بشکن زدن" },
  pat: { image: PatImg, sound: "pat.wav", title: "ضربه به زانو" },
  stomp: { image: StompImg, sound: "stomp.wav", title: "پا کوبیدن" },
  blank: { image: null, sound: null, title: "سکوت" },
};

export type Effect = keyof typeof resources;

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export type Rhythm = {
  id: number;
  effect: string;
  times: number;
};
type RhythmNoId = Omit<Rhythm, "id">;

export const getRhythm = (count: number) => {
  const set1: RhythmNoId[] = [
    { effect: "clap", times: 1 },
    { effect: "clap", times: 1 },
    { effect: "snap", times: 1 },
    { effect: "snap", times: 1 },
  ];

  const set2: RhythmNoId[] = [
    { effect: "clap", times: 1 },
    { effect: "pat", times: 1 },
    { effect: "snap", times: 1 },
    { effect: "pat", times: 1 },
  ];

  const set3: RhythmNoId[] = [
    { effect: "snap", times: 1 },
    { effect: "stomp", times: 1 },
    { effect: "clap", times: 1 },
    { effect: "stomp", times: 1 },
  ];

  const set4: RhythmNoId[] = [
    { effect: "pat", times: 1 },
    { effect: "pat", times: 1 },
    { effect: "blank", times: 1 },
    { effect: "clap", times: 1 },
  ];

  const set5: RhythmNoId[] = [
    { effect: "snap", times: 1 },
    { effect: "clap", times: 2 },
    { effect: "snap", times: 1 },
    { effect: "clap", times: 1 },
  ];

  const sets = [set1, set2, set3, set4, set5];

  const REPEAT_SET = 10;
  const SET_LENGTH = set1.length;

  let set = [...sets[count % sets.length]];
  if (count > sets.length) {
    const index = getRandomNumber(0, SET_LENGTH - 1);
    const effects = ['clap', 'snap', 'pat', 'stomp'];
    const randomEffect = effects[getRandomNumber(0, effects.length - 1)];
    set[index] = { effect: randomEffect, times: getRandomNumber(1, 2) };
  }



  const rhythm: Rhythm[] = injectID(flatten(times(REPEAT_SET, set)));
  return rhythm;
};

export const colors = {
  pink: "#c09cd0",
  green: "#8de6d4",
  brown: "#433d43",
  white: "white",
  yellow: "#ffeb6b",
  violet: "#c09cd0",
  red: "#ef86a6",
};

export const shuffle = <T>([...a]: T[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const times = <T extends {}>(n: number, obj: T[]): T[] => {
  let result: T[] = [];
  for (let i = 0; i < n; i++) {
    result = result.concat(obj);
  }
  return result;
};

export const injectID = (arr: RhythmNoId[]): Rhythm[] =>
  arr.map((item, id) => ({ ...item, id }));

const flatten = <T extends {}>(arr: (T | T[])[]): T[] => {
  return arr.reduce((acc: T[], obj: T | T[]) => {
    if (!Array.isArray(obj)) {
      acc.push(obj);
      return acc;
    } else return acc.concat(obj);
  }, []);
};

export const memoizeOne = (fn) => {
  let cache;
  let last: string;
  return (...args) => {
    const key = JSON.stringify(args);
    if (key == last) return cache;
    cache = fn(...args);
    return cache;
  };
};
