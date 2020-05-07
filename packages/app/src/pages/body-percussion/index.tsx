import React from "react";
import { View } from "react-native";
import IntroStep from "./intro";
import ExplainStep from "./explain";
import StartStep from "./start";
import PlayStep from "./play";

const BodyPercussionScreen = () => {
  const [page, setPage] = React.useState("play");
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

  console.log('herelo')
  // return <Component next={handleNextPage} />;
  return <View style={{ flex: 1, backgroundColor: "red" }}></View>;
};

export default BodyPercussionScreen;
