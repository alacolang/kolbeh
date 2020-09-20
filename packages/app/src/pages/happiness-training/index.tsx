import React from "react";
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

const fullWidth = Dimensions.get("window").width;
const imageWidth = fullWidth / 2 - 80;
const slideWidth = fullWidth - 140;
const slideHeight = slideWidth * 1.4;

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

  const { data, loading } = useQuery<HappinessTrainingData>(
    GET_HAPPINESS_TRAININGS,
    {}
  );

  const categories = data?.happinessTraining.categories;

  console.log({ categories });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Bar navigation={navigation} />
      <View style={{ paddingLeft: 20 }}>
        <FormattedText id="happiness.greeting.1" style={{ fontSize: 15 }} />
        <FormattedText id="happiness.greeting.2" style={{ fontSize: 15 }} />
      </View>
      <View>
        <ScrollView
          horizontal
          style={{ transform: [{ scaleX: -1 }] }}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories?.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
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
              <TouchableOpacity
                style={styles.enterContainer}
                onPress={() =>
                  navigation.navigate("happinessCategory", { category })
                }
              >
                <FormattedText id="enter" style={styles.enter}></FormattedText>
              </TouchableOpacity>
            </View>
          ))}
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
  enterContainer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    backgroundColor: colors.secondary,
    borderRadius: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: slideWidth / 2,
  },
  enter: { color: "white", top: -4, fontSize: 18 },
  categoriesContainer: {
    // borderWidth: 1,
    paddingTop: 40,
    paddingLeft: 90,
    paddingBottom: 20,
    // height: slideHeight + 40,
  },
  categoryContainer: {
    transform: [{ scaleX: -1 }],
    paddingHorizontal: 20,
    marginHorizontal: 30,
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
    fontSize: 28,
    marginTop: 30,
    color: colors.primaryVarient,
  },
  categoryDescription: {
    fontSize: 22,
    marginTop: 30,
    color: colors.primary,
    lineHeight: 22 * 1.4,
    width: slideWidth / 1.5,
    // borderWidth: 1,
  },
});

export default HappinessTraining;
