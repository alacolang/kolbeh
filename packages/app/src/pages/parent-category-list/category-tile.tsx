import React from "react";
import { Dimensions, TouchableOpacity, StyleSheet, View } from "react-native";
import { ICategory } from "types";
import { Icon } from "components/icon";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";

const width = Dimensions.get("window").width;

type Props = {
  category: ICategory;
  onPress: () => void;
};

const format = (text: string) => text.substr(0, 25);

const CategoryTile = ({ category, onPress }: Props) => {
  console.log({ icon: category.icon });
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
          <Icon name="leftArrow" size="small" />
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
    // borderWidth: 1,
  },
  container: {
    backgroundColor: colors.backgroundVariant,
    width: width - 70,
    flexDirection: "row",
    marginVertical: 40,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    // borderWidth: 1,
  },
  texts: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: colors.secondary,
    marginBottom: 20,
    // fontWeight: 600
    // fontWeight: "bold",
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
