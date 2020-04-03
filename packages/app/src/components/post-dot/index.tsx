import React from "react";
import styled from "styled-components/native";
import colors from "../../colors";

const Dots = () => {
  return (
    <>
      <DotWrapper />
      <Dot />
    </>
  );
};

const DotWrapper = styled.View`
  position: absolute;
  left: -2px;
  top: -2px;
  border-radius: 18px;
  width: 18px;
  height: 18px;
  background-color: ${colors.background};
`;

const Dot = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 14px;
  width: 14px;
  height: 14px;
  background-color: ${colors.green};
`;

export default Dots;
