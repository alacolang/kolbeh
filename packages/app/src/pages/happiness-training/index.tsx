import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
  ImageSourcePropType,
  InteractionManager,
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
import Bar, { BAR_WIDTH } from "navigation/menu";
import { TabParamList } from "navigation/tab-navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import { Trans, useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import Loading from "components/loading";
import { State } from "context/happiness";
import img1 from "../../assets/images/1.gif";
import img2 from "../../assets/images/2.gif";
import img3 from "../../assets/images/3.gif";
import selfCompassion from "../../assets/images/self-compassion.gif";
import resilience from "../../assets/images/resilience.gif";
import kindness from "../../assets/images/kindness.gif";
import empathy from "../../assets/images/empathy.gif";
import connection from "../../assets/images/connection.gif";
import optimism from "../../assets/images/optimism.gif";
import mindfulness from "../../assets/images/mindfulness.gif";
import Svg, { Ellipse } from "react-native-svg";
import { useIdentity } from "context/identity";
import { NetworkStatus } from "apollo-client";
import { useConnectivity } from "context/connectivity";

const fullWidth = Dimensions.get("window").width;
const slideGutter = 25;
const slideWidth = fullWidth - BAR_WIDTH - 2 * slideGutter - 40;
const slideHeight = (slideWidth * 320) / 200;
export const imageSize = Math.min(slideWidth - 16 * 2, slideHeight / 2.5);

export const IMAGES: Record<any, ImageSourcePropType> = {
  "self-compassion": selfCompassion,
  compassion: empathy,
  resilience,
  gratitude: img3,
  kindness,
  empathy,
  connection,
  optimism,
  awe: img1,
  mindfulness,
  forgiveness: img2,
};

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

  const {
    state: { name },
  } = useIdentity();
  const happiness = useHappiness();
  const { t } = useTranslation();
  const ref = useRef<ScrollView>(null);

  const { data, loading, error, refetch, networkStatus } = useQuery<
    HappinessTrainingData
  >(GET_HAPPINESS_TRAININGS, {
    // fetchPolicy: "network-only",
    fetchPolicy: "cache-first",
  });

  const newCategories = data?.happinessTraining.categories ?? [];
  const categories = happiness.rawCategories;
  const categoryToTryNext = happiness.categoryToTryNext();

  useFocusEffect(
    useCallback(() => {
      if (!categories) {
        refetch();
      }
    }, [categories, refetch])
  );

  const { isConnected } = useConnectivity();

  const _refetch = useCallback(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      if (refetch) {
        await refetch();
      }
    });
    return () => task.cancel();
  }, [refetch]);

  useEffect(() => {
    if (categories.length === 0 && isConnected) {
      _refetch();
    }
  }, [isConnected, _refetch, categories.length]);

  useEffect(() => {
    if (newCategories.length === 0) {
      return;
    }
    happiness.updateRawCategories(newCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategories]);

  const slidesX = useRef<Record<string, number>>({});

  const jumpToCategory = useCallback(() => {
    if (
      categoryToTryNext === "all-done" ||
      categoryToTryNext === "not-now" ||
      categoryToTryNext === null
    ) {
      return;
    }

    setTimeout(() => {
      const x = slidesX.current[categoryToTryNext.id];
      if (x) {
        ref.current?.scrollTo({
          x: x - 24,
          animated: true,
        });
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToTryNext]);

  useFocusEffect(jumpToCategory);
  useEffect(jumpToCategory, [loading, jumpToCategory]);

  const header = (
    <View style={styles.greetingContainer}>
      <FormattedText style={styles.greeting}>
        <Trans
          i18nKey="happiness.greeting.hello"
          values={{ name }}
          components={[<FormattedText style={styles.greeting} />]}
        />
      </FormattedText>
      {categoryToTryNext === "all-done" ? (
        <FormattedText style={styles.greeting}>
          <Trans
            i18nKey="happiness.greeting.allDone"
            components={[<FormattedText style={styles.greetingCategory} />]}
          />
        </FormattedText>
      ) : categoryToTryNext === "not-now" ? (
        <FormattedText
          style={styles.greeting}
          id="happiness.greeting.enoughForToday"
        />
      ) : categoryToTryNext?.title ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("happinessCategory", {
              category: categoryToTryNext,
            })
          }
        >
          <FormattedText style={styles.greeting}>
            <Trans
              i18nKey="happiness.greeting.tryNow"
              values={{ title: categoryToTryNext?.title ?? "" }}
              components={[<FormattedText style={styles.greetingCategory} />]}
              parent={FormattedText}
            />
          </FormattedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const slides = (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToInterval={slideWidth + slideGutter}
        decelerationRate={"fast"}
        contentContainerStyle={styles.slider}
        ref={ref}
      >
        {loading && categories?.length === 0 ? (
          <View style={[slideStyles.container, { left: -28 }]}>
            <Loading />
          </View>
        ) : (
          categories?.map((category) => {
            const state = happiness.categories[category.id]?.state;

            return (
              <Slide
                key={category.id}
                t={t}
                category={category}
                state={state}
                setSlideX={(x: number) => {
                  slidesX.current[category.id] = x;
                }}
                onClick={() =>
                  navigation.navigate("happinessCategory", { category })
                }
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Bar navigation={navigation} />
      <View style={styles.contentContainer}>
        {categories.length === 0 && error ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {networkStatus === NetworkStatus.error ? (
              <FormattedText
                id="error.connection"
                style={{ color: colors.primary }}
              />
            ) : (
              <FormattedText
                id="error.misc"
                style={{ color: colors.primary }}
              />
            )}
          </View>
        ) : (
          <>
            {header}
            {slides}
          </>
        )}
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
    marginBottom: 16,
    flexGrow: 1,
    paddingLeft: BAR_WIDTH,
    justifyContent: "space-between",
  },
  slider: {
    paddingRight: 32,
    paddingLeft: 8,
  },
  greetingContainer: {
    paddingLeft: 16,
    flexDirection: "column",
  },
  greeting: {
    fontSize: 16,
    color: colors.primary,
    lineHeight: 18 * 1.8,
    paddingHorizontal: 16,
  },
  greetingCategory: { color: colors[1] },
});

type SlideProps = {
  t: TFunction;
  category: Types.IHappinessTrainingCategory;
  state: State["state"];
  onClick: () => void;
  setSlideX: (x: number) => void;
};

const Slide = ({ category, state, onClick, setSlideX }: SlideProps) => {
  return (
    <View
      key={category.id}
      style={[
        slideStyles.container,
        {
          backgroundColor:
            state === "locked"
              ? colors.backgroundPrimaryVariant
              : colors.secondaryVarient,
        },
      ]}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout;
        setSlideX(layout.x);
      }}
    >
      <TouchableOpacity disabled={state === "locked"} onPress={() => onClick()}>
        <Gif image={IMAGES[category.id]} />
        <View style={slideStyles.contentContainer}>
          <FormattedText style={slideStyles.categoryTitle}>
            {category.title}
          </FormattedText>
          <FormattedText
            style={[
              slideStyles.categoryDescription,
              {
                color:
                  state === "locked" ? colors.backgroundLight : colors.primary,
              },
            ]}
          >
            {category.description}
          </FormattedText>
        </View>
        <View style={slideStyles.footer}>
          {state === "locked" ? (
            <View style={slideStyles.lockContainer}>
              <IconSvg name="lockFill" size="small" color={colors[10]} />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const slideStyles = StyleSheet.create({
  lockContainer: {
    position: "absolute",
    bottom: 0,
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
  },

  container: {
    paddingHorizontal: 16,
    marginLeft: slideGutter,
    backgroundColor: colors.secondaryVarient,
    borderRadius: 20,
    width: slideWidth,
    height: slideHeight,
    paddingVertical: 16,
    alignItems: "center",
    marginVertical: 16,
    // marginHorizontal: 20,
    // borderWidth: 2,
    elevation: 5,
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 26,
    color: colors[10],
    textAlign: "center",
  },
  categoryDescription: {
    fontSize: 16,
    lineHeight: 22 * 1.4,
    textAlign: "center",
  },
});

type GifProp = {
  image: ImageSourcePropType;
  dropShadow?: boolean;
  theme?: "purple" | "yellow";
};
export const Gif = ({
  image,
  dropShadow = false,
  theme = "yellow",
}: GifProp) => {
  const xx = imageSize - 40;
  const yy = 10;
  return (
    <View style={gifStyles.imageContainer}>
      <View style={gifStyles.circleContainer}>
        <View
          style={[
            gifStyles.circle,
            {
              borderColor:
                theme === "yellow"
                  ? colors.backgroundSecondary
                  : colors.backgroundPrimary,
            },
          ]}
        />
      </View>
      <Image source={image} style={gifStyles.image} resizeMode="contain" />
      {dropShadow && (
        <View
          style={{
            position: "absolute",
            bottom: -25,
            width: xx,
            height: yy,
          }}
        >
          <Svg viewBox={`0 0 ${xx} ${yy}`} style={{ width: xx, height: yy }}>
            <Ellipse
              cx={xx / 2}
              cy={yy / 2}
              rx={xx / 2}
              ry={yy / 2}
              fill={colors.backgroundSecondary}
            />
          </Svg>
        </View>
      )}
    </View>
  );
};

const gifStyles = StyleSheet.create({
  imageContainer: {
    height: imageSize + 20, // extra number is for elevation
    width: imageSize + 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  circleContainer: {
    position: "absolute",
    width: imageSize,
    height: imageSize,
    backgroundColor: "yellow",
    borderRadius: imageSize,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: imageSize + 5,
    height: imageSize + 5,
    backgroundColor: "white",
    borderRadius: imageSize + 5,
    borderWidth: 7,
    elevation: 10,
  },
  image: {
    height: imageSize * 0.65,
    width: imageSize * 0.65,
    // borderWidth: 1,
  },
});

export default HappinessTraining;
