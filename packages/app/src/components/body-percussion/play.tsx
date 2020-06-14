import React from "react";
import {
  View,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSound } from "./sound";
import { Icon } from "components/icon";
import { getRhythm, Rhythm, resources, colors } from "./common";
import TonbakImg from "assets/images/tonbak.png";

const fullWidth = Dimensions.get("window").width;
const w = fullWidth / 3;
const movementColors = [colors.yellow, colors.violet, colors.green, colors.red];
const gap = 15;
const tonbakSize = 220;
const DELAY_MIN = 80;
const DELAY_MAX = 800;
const DELAY_STEP = 100;

type Props = { next: () => void };

const PlayStep = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [rhythm, setRhythm] = React.useState<Rhythm[]>(getRhythm(0));
  const [active, setActive] = React.useState<Rhythm>();
  const [count, setCounter] = React.useState(0);
  const [delay, setDelay] = React.useState(DELAY_MAX);
  const [delayMax, setDelayMax] = React.useState(DELAY_MAX);
  const [play, setPlay] = React.useState(false);

  useSound(active);

  // console.log("root", { play, active, count, delay });

  // change active movement
  function processNext() {
    if (!play) {
      return;
    }
    if (!active) {
      setActive(rhythm[0]);
      return;
    }
    // console.log({ play, id: active.id, count, delay, delayMax });
    const currentIndex = rhythm.findIndex(
      (item: Rhythm) => item.id === active.id
    );
    if (currentIndex + 1 === rhythm.length) {
      setDelay(delayMax);
      // console.log("setting delay to max", { delayMax });
      const nextRhythm = getRhythm(count + 1);
      if (nextRhythm.length === 0) {
        setPlay(false);
        // console.log("all done");
        setCounter(0);
        return;
      }
      setRhythm(nextRhythm);
      // console.log("done, reseting");

      setActive(nextRhythm[0]);
      setCounter(count + 1);
    } else {
      setActive(rhythm[currentIndex + 1]);
    }
    if (currentIndex % 4 === 3 && currentIndex + 1 !== rhythm.length) {
      // console.log({ currentIndex });
      setDelay(
        Math.min(
          delayMax,
          Math.max(DELAY_MIN, delay - (delayMax - DELAY_MIN) / 2.5)
        )
      );
    }
  }

  // disable-eslint-rule react-hooks/exhaustive-deps
  React.useEffect(() => {
    const timeout = setTimeout(
      processNext,
      delay + (active ? active.times * 500 : 0)
    );
    // console.log({ delay, total: delay + (active ? active.times * 500 : 0) });

    return () => clearTimeout(timeout);
  }, [active, play]);

  // animate active movement
  // disable-eslint-rule react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!active) {
      return;
    }

    let times = active.times;

    function play() {
      animatedValue.setValue(0);
      const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      });
      animation.start(() => {
        times = times - 1;
        if (times > 0) {
          play();
        }
      });
    }
    play();
  }, [active]);

  const getMovement = (index: number): React.ReactElement | null => {
    const item: Rhythm = rhythm[index];

    // if (!active) {
    //   return null;
    // }
    if (!item) {
      // console.log("getMovement item not found", {
      //   index,
      //   activeId: active?.id,
      // });
      return null;
    }

    const tops = [0, w * 0.5, w + gap, w * 1.5 + gap];
    const lefts = [0, w + gap, 0, w + gap];

    return (
      <View style={[]} key={index}>
        <Animated.View
          style={[
            styles.movementContainer,
            {
              position: "absolute",
              top: tops[index % 4],
              left: lefts[index % 4],
              backgroundColor: movementColors[index % 4],
              opacity:
                active?.effect === "blank" && item.id === active?.id
                  ? animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.5, 1],
                    })
                  : 1,
              transform: [
                {
                  translateY:
                    active?.effect === "stomp" && item.id === active?.id
                      ? animatedValue.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0, -10, 0],
                        })
                      : 0,
                },
              ],
            },
          ]}
        >
          <Animated.Image
            source={resources[item.effect].image}
            style={[
              styles.movement,
              {
                transform: [
                  {
                    scale:
                      item.id === active?.id
                        ? animatedValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange:
                              item.effect === "pat" ? [1, 0.9, 1] : [1, 1.2, 1],
                          })
                        : 1,
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  };

  let movements: React.ReactElement[] = [];

  if (active) {
    const currentIndex = rhythm.findIndex((item) => item.id === active.id);
    const startIndex = Math.floor(currentIndex / 4) * 4;

    movements = [
      getMovement(startIndex),
      getMovement(startIndex + 1),
      getMovement(startIndex + 2),
      getMovement(startIndex + 3),
    ];
  }

  const decorationsRendered = (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        //  borderWidth: 2,
      }}
    >
      <Image
        source={TonbakImg}
        style={{
          alignSelf: "flex-end",
          // justifyContent:'flex-end',
          // top: 30,
          height: tonbakSize,
          width: tonbakSize,
          zIndex: 10,
        }}
        resizeMode="cover"
      />
    </View>
  );

  const sliderRendered = (
    <View style={styles.sliderContainer}>
      <Slider
        step={DELAY_STEP}
        value={delay}
        onValueChange={(value) => {
          setDelayMax(value);
          // setDelay(value);
        }}
        minimumValue={DELAY_MIN}
        maximumValue={DELAY_MAX}
        minimumTrackTintColor={colors.green}
        maximumTrackTintColor={colors.pink}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {decorationsRendered}
      <View style={styles.movementsOuterContainer}>
        <View style={styles.movementsContainer}>{movements}</View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setPlay(!play);
          }}
        >
          <View style={styles.pauseContainer}>
            {play ? (
              <Icon name="pause" size="medium" />
            ) : (
              <Icon name="play" size="medium" />
            )}
          </View>
        </TouchableOpacity>
        {sliderRendered}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  movementsOuterContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    // borderWidth: 2,
    borderColor: "blue",
    marginTop: tonbakSize - 40,
  },
  movementsContainer: {
    height: 2.5 * w + 2 * gap,
    width: 2 * w,
    // borderWidth: 2,
    borderColor: "red",
  },
  movementContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 5,
    height: w,
    width: w,
    borderRadius: w,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  movement: {
    height: w - 40,
    width: w - 40,
    borderRadius: w - 40,
  },
  text: {
    justifyContent: "center",
    fontSize: 24,
    lineHeight: 24 * 1.3,
    color: "#828282",
  },
  actionsContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    flexDirection: "row",
    // borderWidth: 2,
    // borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: { width: 200 },
  pauseContainer: {
    // borderWidth: 2,
    // borderColor: "red",
    marginRight: 15,
  },
});

export default PlayStep;
