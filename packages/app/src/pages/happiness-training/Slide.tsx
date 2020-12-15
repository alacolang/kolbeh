import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { IconSvg } from "components/icon";
import { State } from "context/happiness";
import { TFunction } from "i18next";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import * as Types from "types";
import { slideGutter, slideWidth, slideHeight } from "./constants";
import Gif, { IMAGES } from "./Gif";

type SlideProps = {
  t: TFunction;
  category: Types.IHappinessTrainingCategory;
  state: State["state"];
  onClick: () => void;
  setSlideX: (x: number) => void;
  numExercisesDone: number;
  totalNumExercises: number;
};

function Slide({
  category,
  state,
  onClick,
  setSlideX,
  numExercisesDone,
  totalNumExercises,
}: SlideProps) {
  return (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.container,
        {
          backgroundColor:
            state === "locked"
              ? colors.backgroundPrimaryVariant
              : colors.secondaryVarient,
        },
      ]}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setSlideX(layout.x);
      }}
      disabled={state === "locked"}
      onPress={() => onClick()}
    >
      <Gif
        image={IMAGES[category.id]}
        numExercisesDone={numExercisesDone}
        totalNumExercises={totalNumExercises}
      />

      <View style={styles.contentContainer}>
        <FormattedText style={styles.categoryTitle}>
          {category.title}
        </FormattedText>
        <FormattedText
          style={[
            styles.categoryDescription,
            {
              color:
                state === "locked" ? colors.backgroundLight : colors.primary,
            },
          ]}
        >
          {category.description}
        </FormattedText>
      </View>
      <View style={styles.footer}>
        {state === "locked" ? (
          <View style={styles.lockContainer}>
            <IconSvg name="lockFill" size="small" color={colors[10]} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  lockContainer: {
    position: "absolute",
    bottom: 0,
    borderRadius: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    marginHorizontal: 16,
  },

  container: {
    paddingHorizontal: 16,
    marginLeft: slideGutter,
    backgroundColor: colors.secondaryVarient,
    borderRadius: 20,
    width: slideWidth,
    height: slideHeight,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 16,
    elevation: 5,
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 26,
    color: colors[10],
    textAlign: "center",
  },
  categoryDescription: {
    fontSize: 16,
    lineHeight: 22 * 1.4,
    textAlign: "center",
  },
});

export default Slide;
