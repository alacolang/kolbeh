import React from "react";
import { StatusBar, View, TouchableOpacity, StyleSheet } from "react-native";
import IntroStep from "./intro";
import ExplainStep from "./explain";
import StartStep from "./start";
import PlayStep from "./play";
import { Icon } from "../icon";

const BodyPercussionScreen = ({ navigation }) => {
  const [page, setPage] = React.useState("intro");
  let Component;
  if (page === "explain") {
    Component = ExplainStep;
  } else if (page === "start") {
    Component = StartStep;
  } else if (page === "play") {
    Component = PlayStep;
  } else if (page === "start") {
    Component = StartStep;
  } else {
    Component = IntroStep;
  }

  const handleNextPage = () => {
    let next = "intro";
    if (page === "intro") {
      next = "explain";
    } else if (page === "explain") {
      next = "start";
    } else if (page === "start") {
      next = "play";
    }
    setPage(next);
  };

  return (
    <>
      <StatusBar hidden />
      {/* <View style={styles.headerContainer}>
        <TouchableOpacity
          // activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backContainer}>
            <Icon name="backDark" size="tiny" />
          </View>
        </TouchableOpacity>
      </View> */}
      <Component next={handleNextPage} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    height: 80,
    // borderWidth: 1,
    // borderColor: 'red'
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
    borderColor: "red",
  },
});

export default BodyPercussionScreen;
