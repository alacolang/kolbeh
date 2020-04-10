import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Animated,
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
  const x = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = Animated.loop(
      Animated.timing(x, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );
    animate.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <Card source={meta.image} index={meta.index} resizeMode="contain">
        <Title color={meta.color}>{category.title}</Title>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              left: meta.index === 0 ? width / 2.5 / 2 : 48 / 2,
              transform: [
                {
                  [meta.index === 0
                    ? "translateY"
                    : "translateX"]: x.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, -5, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name={category.icon} size="medium" />
        </Animated.View>
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
  left: ${({ index }) => (index === 0 ? 50 : -50)}px;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${width / 2.5}px;
  width: ${width / 2.2}px;
  margin-bottom: 15px;
`;

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    top: 20,
  },
});

export default CategoryTile;
