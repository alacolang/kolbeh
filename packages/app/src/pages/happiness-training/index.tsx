import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  CompositeNavigationProp,
  useFocusEffect,
} from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import * as Types from "types";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { ScrollView } from "react-native-gesture-handler";
import { resolveURL } from "utils/resolve";
import Bar from "navigation/menu";
import { TabParamList } from "navigation/tab-navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";

const fullWidth = Dimensions.get("window").width;
const imageWidth = fullWidth / 2 - 80;
const slideWidth = fullWidth - 160;
const slideHeight = (slideWidth * 320) / 200;

const GET_HAPPINESS_TRAININGS = gql`
  query {
    happinessTraining {
      categories {
        id
        title
        description
        about
        image {
          url
        }
        exercises {
          id
          title
          description
        }
      }
    }
  }
`;

type HappinessTrainingData = {
  happinessTraining: Types.IHappinessTraining;
};

export type Navigation = CompositeNavigationProp<
  NavigationProp<TabParamList, "kolbeh">,
  StackNavigationProp<HomeStackParamList>
>;

const HappinessTraining = () => {
  const navigation = useNavigation<Navigation>();
  const happiness = useHappiness();

  const { data, loading } = useQuery<HappinessTrainingData>(
    GET_HAPPINESS_TRAININGS,
    { fetchPolicy: "network-only" }
  );

  const categories = data?.happinessTraining.categories;

  useEffect(() => {
    // useFocusEffect(
    // useCallback(() => {
    //   if (!categories) {
    //     return;
    //   }
    happiness.updateRawCategories(categories);
    // }, [])
  }, [categories]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Bar navigation={navigation} />
      <View style={styles.greetingContainer}>
        <FormattedText id="happiness.greeting.1" style={styles.greeting} />
        <View style={{ flexDirection: "row" }}>
          <FormattedText id="happiness.greeting.2.0" style={styles.greeting} />
          <FormattedText style={styles.greetingCategory}>
            {categories?.[0].title}
          </FormattedText>
          <FormattedText id="happiness.greeting.2.1" style={styles.greeting} />
        </View>
      </View>
      <View>
        <ScrollView
          horizontal
          style={{ transform: [{ scaleX: -1 }] }}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories?.map((category) => {
            const state = happiness.categories[category.id]?.state;
            return (
              <View
                key={category.id}
                style={[
                  styles.categoryContainer,
                  {
                    backgroundColor:
                      state === "locked"
                        ? colors.green
                        : colors.secondaryVarient,
                  },
                ]}
              >
                <Image
                  source={{ uri: resolveURL(category.image.url) }}
                  resizeMode="contain"
                  style={styles.categoryImage}
                />
                <FormattedText style={styles.categoryTitle}>
                  {category.title}
                </FormattedText>
                <FormattedText style={styles.categoryDescription}>
                  {category.description}
                </FormattedText>
                {state === "locked" ? (
                  <View style={styles.lockContainer}>
                    <IconSvg
                      name="lockFill"
                      size="medium"
                      color={colors.secondaryThird}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.enterContainer}
                    onPress={() =>
                      navigation.navigate("happinessCategory", { category })
                    }
                  >
                    <FormattedText id="enter" style={styles.enter} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  lockContainer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    backgroundColor: colors.green,
    borderRadius: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  enterContainer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    backgroundColor: colors.secondary,
    borderRadius: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    width: slideWidth / 2,
  },
  enter: { color: "white", top: -4, fontSize: 18 },
  categoriesContainer: {
    // borderWidth: 1,
    paddingTop: 60,
    paddingLeft: 90,
    paddingBottom: 40,
    // height: slideHeight + 40,
  },
  categoryContainer: {
    transform: [{ scaleX: -1 }],
    paddingHorizontal: 20,
    marginHorizontal: 15,
    backgroundColor: colors.secondaryVarient,
    borderRadius: 20,
    // borderWidth: 1,
    width: slideWidth,
    height: slideHeight,
    justifyContent: "center",
  },
  categoryImage: {
    position: "absolute",
    top: 0,
    right: -20,
    width: imageWidth,
    height: slideHeight / 1.6,
    // borderWidth: 1,
    borderColor: "red",
  },
  categoryTitle: {
    fontSize: 26,
    color: colors.primaryVarient,
  },
  categoryDescription: {
    fontSize: 20,
    marginTop: 30,
    color: colors.primary,
    lineHeight: 22 * 1.4,
    width: slideWidth / 1.5,
    // borderWidth: 1,
  },
  greetingContainer: { paddingLeft: 40 },
  greeting: { fontSize: 18, color: colors.primary, lineHeight: 18 * 1.5 },
  greetingCategory: {
    color: colors.secondary,
    paddingHorizontal: 5,
    fontSize: 18,
  },
});

export default HappinessTraining;
