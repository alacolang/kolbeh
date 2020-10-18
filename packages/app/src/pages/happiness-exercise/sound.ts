import Sound from "react-native-sound";

const SOUNDS = {
  reward_exercise: "reward_exercise.mp3",
  reward_category: "reward_category.mp3",
  happiness_background: "happiness_background.mp3",
} as const;

type SoundNames = keyof typeof SOUNDS;
type Sounds = Record<SoundNames, Sound>;

let sounds = {} as Sounds;

const loadSound = (soundName: SoundNames) => {
  return new Promise<Sound>((resolve, reject) => {
    const sound = new Sound(
      SOUNDS[soundName],
      Sound.MAIN_BUNDLE,
      (error: Error) => {
        if (error) {
          console.warn("failed to load the sound", error);
          reject();
        } else {
          resolve(sound);
        }
      }
    );
  });
};

export const soundNames = Object.keys(SOUNDS) as SoundNames[];

export function load(soundNames: SoundNames[]) {
  return new Promise(async (resolve, reject) => {
    for (const soundName of soundNames) {
      try {
        const sound = await loadSound(soundName);
        sounds[soundName] = sound;
      } catch (e) {
        console.warn("failed to load sound", e);
        reject();
      }
    }
    resolve();
  });
}

export function release() {
  soundNames.forEach((soundName) => {
    sounds[soundName]?.release();
  });
  sounds = {} as Sounds;
  state = { mode: "idle" };
}

type State = { mode: "idle" } | { mode: "playing"; soundName: SoundNames };

let state: State = { mode: "idle" };

export const play = (
  soundName: SoundNames,
  { repeat = false, stopAndPlay = false, volume = 0.8 }
) => {
  function helper() {
    console.log("helper", state, soundName);
    state = { mode: "playing", soundName: soundName };
    sounds[soundName].setVolume(volume);
    sounds[soundName].play((success) => {
      state = { mode: "idle" };
      if (success) {
        // console.log("sound played");
      } else {
        console.warn("sound play failed");
      }
      // if (repeat) helper();
    });
  }
  if (state.mode === "idle") {
    helper();
  } else if (stopAndPlay) {
    if (state.mode === "playing") {
      sounds[state.soundName]?.stop();
      helper();
    }
  }
};
