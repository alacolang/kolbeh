import React from "react";
import {
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useSound } from "./sound";
import { Icon } from "../../components/icon";
import { getRhythm, Rhythm, resources, colors } from "./common";
import TonbakImg from "../../assets/images/tonbak.png";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;
const w = fullWidth / 3;
const movementColors = [colors.yellow, colors.violet, colors.green, colors.red];
const gap = 15;
const tonbakSize = 220;
const DELAY_MIN = 600;
const DELAY_MAX = 1500;
const DELAY_STEP = 200

type Props = { next: () => void };

const PlayStep = (props: Props) => {
  const rhythm = getRhythm();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [active, setActive] = React.useState<Rhythm>(rhythm[0]);
  const [count, setCounter] = React.useState(0);
  const [delay, setDelay] = React.useState(1500);
  const [play, setPlay] = React.useState(false);

  useSound(active);

  // change active movement
  React.useEffect(() => {
    if (!play) return;
    const timeout = setTimeout(() => {
      if (count == 0) {
        setCounter(count + 1);
        setActive(rhythm[0]);
      } else {
        if (!active) return;
        const currentIndex = rhythm.findIndex((item) => item.id === active.id);
        if (currentIndex + 1 === rhythm.length) {
          console.log("done, reseting");
          setActive(rhythm[0]);
          setCounter(count + 1);
          if (delay > DELAY_MIN) {
            setDelay(Math.max(DELAY_MIN, delay - DELAY_STEP));
          }
          // setActive(undefined);
        } else {
          setActive(rhythm[currentIndex + 1]);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, delay, play]);

  // animate active movement
  React.useEffect(() => {
    if (!active) return;

    let times = active.times;

    function play() {
      animatedValue.setValue(0);
      const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      });
      animation.start(() => {
        times = times - 1;
        if (times > 0) play();
      });
    }
    play();
  }, [active]);

  const getMovement = (index: number) => {
    const item: Rhythm = rhythm[index];

    if (!item) {
      console.log("getMovement item not found", { index, activeId: active.id });
      return null;
    }

    const tops = [0, w * 0.5, w + gap, w * 1.5 + gap];
    const lefts = [0, w + gap, 0, w + gap];

    return (
      <View
        style={[
          styles.movementContainer,
          {
            position: "absolute",
            top: tops[index % 4],
            left: lefts[index % 4],
            backgroundColor: movementColors[index % 4],
          },
        ]}
        key={index}
      >
        <Animated.View
          style={{
            // flexDirection: "row",
            transform: [
              {
                translateY:
                  active.effect === "stomp" && item.id === active.id
                    ? animatedValue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -10, 0],
                      })
                    : 0,
              },
            ],
          }}
        >
          <Animated.Image
            source={resources[item.effect].image}
            style={[
              styles.movement,
              {
                transform: [
                  {
                    scale:
                      item.id === active.id
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

  let movements = [];

  if (active) {
    const currentIndex = rhythm.findIndex((item) => item.id === active.id);
    const startIndex = Math.floor(currentIndex / 4) * 4;

    movements = [
      getMovement(startIndex ),
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
          console.log({ value });
          setDelay(value);
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
    height: w - 20,
    width: w - 20,
    borderRadius: w - 20,
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
