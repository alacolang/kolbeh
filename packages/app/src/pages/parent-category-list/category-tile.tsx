import React from "react";
import { Dimensions, TouchableOpacity, StyleSheet, View } from "react-native";
import { ICategory } from "types";
import { Icon, IconSvg } from "components/icon";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";

const width = Dimensions.get("window").width;

type Props = {
  category: ICategory;
  onPress: () => void;
};

const CategoryTile = ({ category, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon name={category.icon} size="huge" />
        </View>
        <View style={styles.texts}>
          <FormattedText style={styles.title}>{category.title}</FormattedText>
          <FormattedText style={styles.description}>
            {category.shortDescription}
          </FormattedText>
        </View>
        <View style={styles.arrow}>
          <IconSvg name="leftArrowFill" size="small" color={colors[1]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: -20,
    left: -20,
  },
  container: {
    backgroundColor: colors.backgroundLight,
    width: width - 70,
    flexDirection: "row",
    marginVertical: 40,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  texts: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: colors[1],
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: colors.primary,
    lineHeight: 18 * 1.5,
    marginBottom: 10,
  },
  arrow: {
    position: "absolute",
    right: 20,
    marginLeft: 30,
  },
});

export default CategoryTile;
