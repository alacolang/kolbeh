import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  Slider,
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
import { IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import { Trans, useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { types } from "@babel/core";

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
  const { t } = useTranslation();

  const { data } = useQuery<HappinessTrainingData>(GET_HAPPINESS_TRAININGS, {
    fetchPolicy: "network-only",
  });

  const categories = data?.happinessTraining.categories;

  useEffect(() => {
    // useFocusEffect(
    // useCallback(() => {
    if (!categories) {
      return;
    }
    happiness.updateRawCategories(categories);
    // }, [])
  }, [categories]);

  const categoryToTryNext:
    | null
    | "all-done"
    | "not-now"
    | Types.IHappinessTrainingCategory =
    (categories ?? []).length > 0
      ? [...(categories ?? [])]
          ?.reverse()
          ?.reduce(
            (
              acc: "all-done" | "not-now" | Types.IHappinessTrainingCategory,
              category: Types.IHappinessTrainingCategory
            ) => {
              if (acc !== "not-now" && acc !== "all-done") {
                return acc;
              }
              const state = happiness.categories[category.id]?.state;
              if (state === "done" && acc === "all-done") {
                return acc;
              }
              if (happiness.categories[category.id]?.state === "unlocked") {
                return category;
              }
              return "not-now";
            },
            "all-done"
          )
      : null;
  const tip = (
    <View style={styles.greetingContainer}>
      <View style={{ flexDirection: "row" }}>
        <FormattedText style={styles.greeting}>
          {categoryToTryNext === "all-done" ? (
            t("happiness.greeting.enoughForToday")
          ) : categoryToTryNext === "not-now" ? (
            t("happiness.greeting.enoughForToday")
          ) : categoryToTryNext?.title ? (
            <Trans
              i18nKey="happiness.greeting.tryNow"
              values={{ title: categoryToTryNext?.title ?? "" }}
              components={[
                <FormattedText style={{ color: "red", fontSize: 18 }} />,
              ]}
            />
          ) : null}
        </FormattedText>
      </View>
    </View>
  );

  const slides = (
    <View>
      <ScrollView
        horizontal
        style={{ transform: [{ scaleX: -1 }] }}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories?.map((category) => {
          const state = happiness.categories[category.id]?.state;

          return (
            <Slide
              key={category.id}
              t={t}
              category={category}
              state={state}
              onClick={() =>
                navigation.navigate("happinessCategory", { category })
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Bar navigation={navigation} />
      <View style={styles.contentContainer}>
        {tip}
        {slides}
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
  contentContainer: {
    marginTop: 64,
    marginBottom: 64,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  categoriesContainer: {
    // borderWidth: 1,
    // paddingTop: 60,
    paddingLeft: 90,
    // height: 00,
    // paddingBottom: 40,
    // height: slideHeight + 40,
  },
  greetingContainer: { paddingLeft: 16, borderWidth: 0 },
  greeting: { fontSize: 16, color: colors.primary, lineHeight: 18 * 1.5 },
  greetingCategory: {
    color: colors.secondary,
    paddingHorizontal: 5,
    fontSize: 18,
  },
});

type SlideProps = {
  t: TFunction;
  category: any;
  state: any;
  onClick: () => void;
};
const Slide = ({ category, state, onClick, t }: SlideProps) => {
  return (
    <View
      key={category.id}
      style={[
        slideStyles.categoryContainer,
        {
          backgroundColor:
            state === "locked" ? colors.green : colors.secondaryVarient,
        },
      ]}
    >
      <Image
        source={{ uri: resolveURL(category.image.url) }}
        resizeMode="contain"
        style={slideStyles.categoryImage}
      />
      <FormattedText style={slideStyles.categoryTitle}>
        {category.title}
      </FormattedText>
      <FormattedText style={slideStyles.categoryDescription}>
        {category.description}
      </FormattedText>
      {state === "locked" ? (
        <View style={slideStyles.lockContainer}>
          <IconSvg
            name="lockFill"
            size="medium"
            color={colors.secondaryThird}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={slideStyles.enterContainer}
          onPress={() => onClick()}
        >
          <FormattedText style={slideStyles.enter}>
            {t("happiness.training.enter")}
          </FormattedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const slideStyles = StyleSheet.create({
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
});

export default HappinessTraining;
