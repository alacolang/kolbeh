import React from "react";
import Sound from "react-native-sound";
import { Rhythm, resources } from "./common";

export const useSound = (active?: Rhythm) => {
  const [sounds, setSounds] = React.useState<Record<string, Sound>>({});

  React.useEffect(() => {
    // Enable playback in silence mode 222
    Sound.setCategory("Playback");

    const handleError = (error: Error) => {
      if (error) {
        console.warn("failed to load the sound", error);
        return;
      }
    };

    setSounds({
      snap: new Sound(resources.snap.sound, Sound.MAIN_BUNDLE, handleError),
      clap: new Sound(resources.clap.sound, Sound.MAIN_BUNDLE, handleError),
      pat: new Sound(resources.pat.sound, Sound.MAIN_BUNDLE, handleError),
      stomp: new Sound(resources.stomp.sound, Sound.MAIN_BUNDLE, handleError),
    });
  }, []);

  React.useEffect(() => {
    if (!active) {
      return;
    }
    let times = active.times;
    if (!sounds[active.effect]) {
      console.warn("no sounds for ", active);
      return;
    }

    function play() {
      if (!active) return;
      sounds[active.effect].play((success) => {
        if (success) {
          // console.log("sound played");
        } else {
          console.warn("sound play failed");
        }
        times = times - 1;
        if (times > 0) {
          play();
        }
      });
    }
    play();
  }, [active, sounds]);
};
