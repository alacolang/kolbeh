import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ICategory } from "../../types";
import { Icon } from "../../components/icon";
import styled from "styled-components/native";
import colors from "../../colors";
import { FormattedText } from "../../components/formatted-text";

const width = Dimensions.get("window").width;

type Props = {
  category: ICategory;
  onPress: () => void;
};

const CategoryTile = ({ category, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Card>
        <View style={styles.iconContainer}>
          <Icon name={category.icon} size="large" />
        </View>
        <Dot />
        <Title>{category.title}</Title>
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
`;

const Dot = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 14px;
  width: 14px;
  height: 14px;
  background-color: white;
`;

const Card = styled.View`
  flex-direction: row;
  background-color: ${colors.orange};
  justify-content: flex-start;
  align-items: center;
  height: ${44 * 4}px;
  padding: 0 25px;
  width: ${width - 50}px;
  border-radius: 10px;
  margin-bottom: 15px;
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
    borderWidth: 2,
    borderColor: "white",
  },
});

export default CategoryTile;
