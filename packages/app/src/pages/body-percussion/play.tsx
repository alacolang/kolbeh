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
import Svg, { Path, Rect, Defs, Pattern, Circle } from "react-native-svg";
import { useSound } from "./sound";
import { getRhythm, Rhythm, resources, colors } from "./common";
import TonbakImg from "../../assets/images/tonbak.png";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

type Props = { next: () => void };
const PlayStep = (props: Props) => {
  const rhythm = getRhythm();
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [active, setActive] = React.useState<Rhythm>(rhythm[0]);
  const [count, setCounter] = React.useState(0);
  const [speed, setSpeed] = React.useState(1000);
  const [play, setPlay] = React.useState(false);

  useSound(active);
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
          if (speed > 400) {
            setSpeed(speed - 200);
          }
          // setActive(undefined);
        } else {
          setActive(rhythm[currentIndex + 1]);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [active, speed, play]);

  React.useEffect(() => {
    if (!active) return;

    let times = active.times;

    function play() {
      animatedValue.setValue(0);
      const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      });
      animation.start(() => {
        times = times - 1;
        if (times > 0) play();
      });
    }
    play();
  }, [active]);

  const getMovement = (index: number) => {
    // const item: Rhythm = rhythm[index];
    const item = rhythm[index];

    if (!item) {
      console.log("getMovement item not found", { index, activeId: active.id });
      return null;
    }
    return (
      <View style={styles.movementContainer} key={index}>
        <Animated.View
          style={{
            flexDirection: "row",
            transform: [
              {
                translateY:
                  active.effect === "stomp"
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
          {item.times === 2 && (
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
                                item.effect === "pat"
                                  ? [1, 0.9, 1]
                                  : [1, 1.2, 1],
                            })
                          : 1,
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      </View>
    );
  };

  let movements = [];

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

  const w = fullWidth / 3;

  const stuff = (
    <View
      style={{
        //  borderWidth: 2,
      }}
    >
      <Image
        source={TonbakImg}
        style={{
          alignSelf: "flex-end",
          // justifyContent:'flex-end',
          top: 30,
          height: 200,
          width: 220,
          zIndex: 10,
        }}
        resizeMode="contain"
      />
    </View>
  );

  console.log("here");

  return (
    <View style={styles.container}>
      {stuff}
      {/* {movements} */}
      <View>
        <TouchableOpacity
          onPress={() => {
            setPlay(!play);
          }}
        >
          <Text>{play ? "stop" : "play"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 25,
    paddingTop: 30,
    // alignItems: "center",
    // justifyContent: "center",
  },
  movementsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: 10,
    flexDirection: "column",
    // borderWidth: 1,
    // paddingTop: 50,
  },
  movements: {
    justifyContent: "center",
    alignItems: "center",
  },
  movementContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 5,
    height: fullWidth / 2.7,
    width: fullWidth / 2.7,
    borderRadius: fullWidth / 2.7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  movement: {
    height: fullWidth / 2.7 - 20,
    width: fullWidth / 2.7 - 20,
    borderRadius: fullWidth / 2.7 - 20,
  },
  background: {
    position: "absolute",
    bottom: -20,
    height: fullHeight - 70,
    width: fullWidth,
  },
  text: {
    justifyContent: "center",
    fontSize: 24,
    lineHeight: 24 * 1.3,
    color: "#828282",
  },
});

export default PlayStep;
