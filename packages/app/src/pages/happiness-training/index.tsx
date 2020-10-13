import React, { useEffect } from "react";
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
import { IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import { Trans, useTranslation } from "react-i18next";
import { TFunction } from "i18next";

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
    if (!categories) {
      return;
    }
    happiness.updateRawCategories(categories);
  }, [categories]);

  // useFocusEffect(() => {
  // }, [happiness.categoryToTryNext()]);

  const categoryToTryNext = happiness.categoryToTryNext();

  const tip = (
    <View style={styles.greetingContainer}>
      <View style={{ flexDirection: "row" }}>
        <FormattedText style={styles.greeting}>
          {categoryToTryNext === "all-done" ? (
            <Trans
              i18nKey="happiness.greeting.allDone"
              components={[<FormattedText style={styles.greetingCategory} />]}
            />
          ) : categoryToTryNext === "not-now" ? (
            t("happiness.greeting.enoughForToday")
          ) : categoryToTryNext?.title ? (
            <Trans
              i18nKey="happiness.greeting.tryNow"
              values={{ title: categoryToTryNext?.title ?? "" }}
              components={[<FormattedText style={styles.greetingCategory} />]}
            />
          ) : null}
        </FormattedText>
      </View>
    </View>
  );

  const slides = (
    <View>
      <ScrollView horizontal style={styles.slider}>
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
    paddingRight: 90,
    justifyContent: "space-between",
  },
  slider: { transform: [{ scaleX: -1 }], marginLeft: 36 },
  greetingContainer: { paddingLeft: 32 },
  greeting: { fontSize: 20, color: colors.primary, lineHeight: 18 * 1.8 },
  greetingCategory: { color: colors.greenVariant },
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
      <View style={slideStyles.footer}>
        {state === "locked" ? (
          <View style={slideStyles.lockContainer}>
            <IconSvg
              name="lockFill"
              size="small"
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
    </View>
  );
};

const slideStyles = StyleSheet.create({
  lockContainer: {
    position: "absolute",
    bottom: 0,
    // left: 32,
    backgroundColor: colors.green,
    borderRadius: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    // justifyContent: "center",
    // alignItems: "center",
  },
  enterContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 44,
    height: 44,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: slideWidth / 2,
  },
  enter: { color: "white", top: -4, fontSize: 18 },
  categoryContainer: {
    transform: [{ scaleX: -1 }],
    paddingHorizontal: 20,
    marginLeft: 35,
    marginTop: 40,
    backgroundColor: colors.secondaryVarient,
    borderRadius: 20,
    // borderWidth: 1,
    width: slideWidth,
    height: slideHeight,
    // justifyContent: "center",
    paddingTop: slideHeight / 6,
  },
  categoryImage: {
    position: "absolute",
    top: -40,
    // zIndex: 1,
    right: -30,
    width: imageWidth,
    height: slideHeight / 1.6,
    // borderWidth: 1,
    // borderColor: "red",
  },
  categoryTitle: {
    fontSize: 26,
    color: colors.primaryVarient,
  },
  categoryDescription: {
    fontSize: 20,
    marginTop: slideHeight / 4,
    color: colors.primary,
    lineHeight: 22 * 1.4,
    // width: slideWidth / 1.5,
    // paddingHorizontal: 16,
    // borderWidth: 1,
  },
});

export default HappinessTraining;
