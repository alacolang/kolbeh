import React from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { ICategory } from "../../types";
import { Icon } from "../../components/icon";
import styled from "styled-components/native";
import { FormattedText } from "../../components/formatted-text";

const width = Dimensions.get("window").width;

type Props = {
  category: ICategory;
  onPress: () => void;
  meta: {
    index: number;
    backgroundColor: String;
    color: String;
  };
};

const CategoryTile = ({ category, onPress, meta }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Card
        index={meta.index}
        start={{ x: -0.5, y: -0.5 }}
        end={{ x: 1, y: 1.0 }}
        colors={["#FFFFFF", meta.backgroundColor]}
      >
        <Title>{category.title}</Title>
        <IconContainer index={meta.index}>
          <Icon name={category.icon} size="medium" />
        </IconContainer>
      </Card>
    </TouchableOpacity>
  );
};

const Title = styled(FormattedText)`
  font-size: 18px;
  color: white;
  padding: 0 15px;
  line-height: 36px;
  flex-grow: 1;
  text-align: center;
`;

const Card = styled(LinearGradient)`
  left: ${({ index }) => (index == 0 ? 50 : -50)}px;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${width / 2.5}px;
  width: ${width / 2.5}px;
  border-radius: ${width / 2.5}px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 4;
`;

const IconContainer = styled(View)`
  left: ${(props) => (props.index == 0 ? width / 2.5 / 2 : 48 / 2)}px;
  position: absolute;
  top: 15;
`;

export default CategoryTile;
