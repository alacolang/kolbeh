import colors from "colors";
import { Icon, IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const frameWidth = Dimensions.get("window").width - 16 * 2;
const size = frameWidth / 3 - 3 * 2;

function Profile({ navigation }) {
  const happiness = useHappiness();

  const ys = [16, -3, -10, -3, 16];
  const xs = [-2, 3, 0, -3, 2];
  const categories = happiness.rawCategories.map((category) => {
    const exercises = category.exercises.map((exercise, index) => {
      const isDone = happiness.exercises[exercise.id].state === "done";
      return (
        <View
          style={{
            paddingHorizontal: 2,
            position: "relative",
            top: -ys[index],
            right: xs[index],
          }}
        >
          <IconSvg
            name="star"
            size={(size - 2 * 2) / 5 - 2 * 2}
            color={isDone ? "#FFDC25" : "lightgrey"}
          />
        </View>
      );
    });

    return (
      <View
        style={{
          marginHorizontal: 3,
          marginVertical: 3,
          width: size,
          height: size,
          borderRadius: size,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          elevation: 4,
        }}
      >
        <IconSvg
          name={`happinessToolbox-${category.id}`}
          size={size / 2}
          color={colors.green}
        />
        <View style={{ flexDirection: "row" }}>{exercises}</View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <IconSvg
          name="cloud"
          color="white"
          size="small"
          style={styles.cloud1}
        />
        <View style={styles.avatar}>
          <Icon name="avatar" size="large" />
        </View>
        <IconSvg name="cloud" color="white" size="huge" style={styles.cloud2} />
      </View>
      <View
        style={{
          justifyContent: "center",
          borderColor: "red",
        }}
      >
        <View
          style={{
            flexDirection: "row-reverse",
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
