import React from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Icon } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { useSound } from "./sound";
import { Rhythm, resources, colors, injectID } from "./common";

const fullWidth = Dimensions.get("window").width;

type Props = { next: () => void };

const getRhythm = (step: number) => {
  let result = [
    { effect: "clap", times: 1 },
    { effect: "snap", times: step === 4 ? 2 : 1 },
    { effect: step === 3 ? "blank" : "pat", times: 1 },
    { effect: "stomp", times: 1 },
  ];

  if (step === 5) {
    result = result.concat([
      { effect: "clap", times: 1 },
      { effect: "blank", times: 1 },
      { effect: "pat", times: 1 },
      { effect: "stomp", times: 1 },
    ]);
  }
  return injectID(result);
};

const ExplainStep = ({ next }: Props) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [step, setStep] = React.useState(1);
  let rhythm = getRhythm(step);
  const [active, setActive] = React.useState<Rhythm>(rhythm[0]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      next();
    }
  };
  useSound(active);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!active) {
        setActive(rhythm[0]);
      } else {
        const currentIndex = rhythm.findIndex((item) => item.id === active.id);
        if (currentIndex + 1 === 4) {
          return setActive(rhythm[0]);
        }
        setActive(rhythm[currentIndex + 1]);
      }
    }, active.times * 500 + 200);
    return () => clearTimeout(timeout);
  }, [active]);

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
  }, [active, animatedValue]);

  const renderMovement = ({ id, effect }: Rhythm) => {
    return (
      <View key={id} style={styles.movementContainer}>
        <Animated.View
          style={[
            styles.movementIconContainer,
            {
              backgroundColor: id % 2 === 0 ? colors.pink : colors.green,
              opacity:
                active?.effect === "blank" && id === active?.id
                  ? animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.5, 1],
                    })
                  : 1,
            },
          ]}
        >
          <Animated.Image
            source={resources[effect].image}
            style={[
              styles.movementIcon,
              {
                transform: [
                  {
                    scale:
                      effect === active.effect
                        ? animatedValue.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange:
                              effect === "pat" ? [1, 0.9, 1] : [1, 1.2, 1],
                          })
                        : 1,
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
        {step === 1 && (
          <FormattedText style={styles.movementTitle}>
            {resources[effect].title}
          </FormattedText>
        )}
      </View>
    );
  };

  const movementsRendered = rhythm.map(renderMovement);

  return (
    <View style={styles.container}>
      <FormattedText id="body-percussion.explain.title" style={styles.title} />
      <FormattedText
        id={`body-percussion.explain.tip${step}`}
        style={styles.text}
      />
      <View style={styles.movementsContainer}>{movementsRendered}</View>
      <TouchableOpacity onPress={handleNext} style={styles.nextContainer}>
        <Icon name="leftArrow" size="medium" />
      </TouchableOpacity>
    </View>
  );
};

const w = (fullWidth - 30 * 2) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: colors.brown,
  },
  movementsContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  movementContainer: {
    paddingHorizontal: 3,
    paddingTop: 30,
    alignItems: "center",
  },
  movementIconContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    height: w,
    width: w,
    borderRadius: w,
    justifyContent: "center",
    alignItems: "center",
  },
  movementIcon: {
    height: w - 20,
    width: w - 20,
    borderRadius: w - 20,
  },
  title: {
    fontSize: 36,
    color: colors.green,
    paddingBottom: 15,
    paddingTop: 45,
  },
  text: {
    justifyContent: "center",
    fontSize: 24,
    lineHeight: 24 * 1.3,
    color: colors.white,
    textAlign: "center",
    height: 150,
    paddingHorizontal: 25,
    // borderWidth: 1
  },
  movementTitle: {
    fontSize: 18,
    color: colors.white,
    paddingTop: 10,
  },
  nextContainer: { height: 100 },
});

export default ExplainStep;
