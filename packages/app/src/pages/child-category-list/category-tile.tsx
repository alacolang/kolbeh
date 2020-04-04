import React from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
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
    color: string;
    image: any;
  };
};

const CategoryTile = ({ category, onPress, meta }: Props) => {
  console.log(meta.color)
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Card source={meta.image} index={meta.index} resizeMode="contain">
        <Title color={meta.color}>{category.title}</Title>
        <IconContainer index={meta.index}>
          <Icon name={category.icon} size="medium" />
        </IconContainer>
      </Card>
    </TouchableOpacity>
  );
};

const Title = styled(FormattedText)`
  color: ${({ color }) => color};
  font-size: 18px;
  padding: 0 15px;
  line-height: 36px;
  flex-grow: 1;
  text-align: center;
`;

const Card = styled(ImageBackground)`
  left: ${({ index }) => (index == 0 ? 50 : -50)}px;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${width / 2.5}px;
  width: ${width / 2.2}px;
  margin-bottom: 15px;
`;

const IconContainer = styled(View)`
  left: ${(props) => (props.index == 0 ? width / 2.5 / 2 : 48 / 2)}px;
  position: absolute;
  top: 20px;
`;

export default CategoryTile;
