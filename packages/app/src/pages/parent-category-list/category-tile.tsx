import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { ICategory } from "../../types";
import { Icon } from "../../components/icon";
import styled from "styled-components/native";
import { FormattedText } from "../../components/formatted-text";
import Dot from "../../components/post-dot";

const width = Dimensions.get("window").width;

type Props = {
  category: ICategory;
  onPress: () => void;
  meta: {
    backgroundColor: String;
    color: String;
  };
};

const CategoryTile = ({ category, onPress, meta }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Card backgroundColor={meta.backgroundColor}>
        <View style={styles.iconContainer}>
          <Icon name={category.icon + "Active"} size="medium" />
        </View>
        <Dot />
        <Title color={meta.color}>{category.title}</Title>
      </Card>
    </TouchableOpacity>
  );
};

const Title = styled(FormattedText)`
  font-size: 18px;
  color: ${(props) => props.color};
  padding: 0 15px;
  line-height: 36px;
  flex-grow: 1;
`;

const Card = styled.View`
  background-color: ${(props) => props.backgroundColor};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
  padding: 0 25px;
  width: ${width - 50}px;
  border-radius: 10px;
  margin-bottom: 30px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;

  elevation: 4;
`;

const styles = StyleSheet.create({
  iconContainer: {
    width: 44 * 2,
    height: 44 * 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 44,
  },
});

export default CategoryTile;
