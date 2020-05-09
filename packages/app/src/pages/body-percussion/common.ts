import ClapImg from "../../assets/images/clap.png";
import SnapImg from "../../assets/images/snap.png";
import PatImg from "../../assets/images/pat.png";
import StompImg from "../../assets/images/stomp.png";
// import ClapImg from "../../assets/images/clapping.png";
// import SnapImg from "../../assets/images/snapping.png";
// import PatImg from "../../assets/images/patting.png";
// import StompImg from "../../assets/images/stomping.png";

export const resources = {
  clap: { image: ClapImg, sound: "stomp.mp3", title: "دست زدن" },
  snap: { image: SnapImg, sound: "stomp.mp3", title: "بشکن زدن" },
  pat: { image: PatImg, sound: "stomp.mp3", title: "ضربه به زانو" },
  stomp: { image: StompImg, sound: "stomp.mp3", title: "پا کوبیدن" },
  blank: { image: null, sound: null, title: "سکوت" },
};

export type Effect = keyof typeof resources;

export type Rhythm = {
  id: number;
  effect: string;
  times: number;
};
type RhythmNoId = Omit<Rhythm, "id">;

export const getRhythm = () => {
  const set1: RhythmNoId[] = [
    { effect: "clap", times: 2 },
    { effect: "blank", times: 1 },
    { effect: "blank", times: 1 },
    { effect: "blank", times: 1 },
  ];

  const rhythm: Rhythm[] = injectID(flatten([times(4, set1)]));

  // console.log("rhythm", rhythm);
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
