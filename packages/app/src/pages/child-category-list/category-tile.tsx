import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { ICategory } from "types";
import { Icon } from "components/icon";
import { FormattedText } from "components/formatted-text";

type Props = {
  category: ICategory;
  onPress: () => void;
  meta: {
    index: number;
    color: string;
    backgroundColor: string;
    // image: any;
  };
};

const CategoryTile = ({ category, onPress, meta }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View style={[styles.card, { paddingLeft: meta.index === 1 ? 50 : 0 }]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: meta.backgroundColor },
          ]}
        >
          <Icon name={category.icon} size="medium" />
        </View>
        <FormattedText style={[styles.title, { color: meta.color }]}>
          {category.title}
        </FormattedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    // justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 36,
    paddingHorizontal: 20,
  },
  iconContainer: {
    // position: "absolute",
    // top: 20,
    opacity: 0.8,
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 200,
  },
});

export default CategoryTile;
