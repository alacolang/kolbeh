import colors from "colors";
import { Icon, IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Header } from "../settings/index";

const frameWidth = Dimensions.get("window").width - 16 * 2;
const size = frameWidth / 3 - 4 * 2;

function Profile({ navigation }) {
  const happiness = useHappiness();

  const ys = [14, 1, -3, 1, 14];
  const xs = [5, 5, 0, -5, -5];
  const categories = happiness.rawCategories.map((category) => {
    const exercises = category.exercises.map((exercise, index) => {
      const isDone = happiness.exercises[exercise.id].state === "done";
      return (
        <View
          style={{
            // paddingHorizontal: 2,
            position: "relative",
            top: -ys[index],
            right: xs[index],
          }}
        >
          <IconSvg
            name="star"
            size={(size - 2 * 2) / 7 - 2 * 2}
            color={isDone ? "#FFDC25" : "lightgrey"}
          />
        </View>
      );
    });

    return (
      <View
        style={{
          marginHorizontal: 3,
          width: size,
          height: size,
          alignItems: "center",
          paddingTop: 18,
        }}
      >
        <Icon
          name="medal"
          size={0}
          style={{
            position: "absolute",
            width: size,
            height: size,
          }}
        />
        <IconSvg
          name={`happinessToolbox-${category.id}`}
          size={size / 3}
          color={colors.greenVariant}
        />
        <View style={{ flexDirection: "row" }}>{exercises}</View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header />
      <View
        style={{
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {categories}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundVariant,
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    // borderWidth: 1,
    marginBottom: 16,
  },
  cloud1: { position: "absolute", bottom: 16, left: 16 },
  avatar: {
    borderWidth: 4,
    borderRadius: 500,
    margin: 10,
    padding: 10,
    borderColor: colors.secondary,
  },
  cloud2: { position: "absolute", top: 0, width: 80, right: 16 },
  row: { borderWidth: 0, flexGrow: 1 },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    height: 70,
  },
  itemTitle: {
    paddingHorizontal: 40,
    color: colors.primary,
    fontSize: 20,
  },
});

export default Profile;
