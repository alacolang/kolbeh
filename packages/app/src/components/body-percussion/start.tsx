import React from "react";
import Slider from "@react-native-community/slider";
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Icon } from "components/icon";
import { FormattedText } from "components/formatted-text";
import { Rhythm, colors, injectID } from "./common";

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
  const [step, setStep] = React.useState(1);

  return (
    <View style={styles.container}>
      <FormattedText id="body-percussion.start.title" style={styles.title} />
      <FormattedText id={"body-percussion.start.tip1"} style={styles.text} />
      <View style={styles.sliderContainer}>
        <Slider
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={colors.green}
          maximumTrackTintColor={colors.pink}
        />
      </View>
      <FormattedText id={"body-percussion.start.tip2"} style={styles.text} />
      <View style={styles.pauseContainer}>
        <Icon name="pause" size="medium" />
      </View>
      <TouchableOpacity onPress={next} style={styles.nextContainer}>
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
  title: {
    fontSize: 36,
    color: colors.green,
    paddingBottom: 15,
    paddingTop: 45,
  },
  text: {
    // justifyContent: "center",
    fontSize: 24,
    lineHeight: 24 * 1.7,
    color: colors.white,
    textAlign: "center",
    // height: 150,
    paddingHorizontal: 25,
    // borderWidth: 1,
  },
  sliderContainer: { width: 200, paddingVertical: 50 },
  pauseContainer: { flex: 1, paddingVertical: 50 },
  nextContainer: { height: 100 },
});

export default ExplainStep;
