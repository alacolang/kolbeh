import React from "react";
import { StatusBar } from "react-native";
import IntroStep from "./intro";
import ExplainStep from "./explain";
import StartStep from "./start";
import PlayStep from "./play";

const BodyPercussionScreen = () => {
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
      <Component next={handleNextPage} />
    </>
  );
};

export default BodyPercussionScreen;
