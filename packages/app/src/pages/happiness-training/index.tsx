import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  useNavigation,
  NavigationProp,
  CompositeNavigationProp,
  useFocusEffect,
} from "@react-navigation/core";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import Bar, { BAR_WIDTH } from "navigation/menu";
import { TabParamList } from "navigation/tab-navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { Trans, useTranslation } from "react-i18next";
import Loading from "components/loading";
import { useIdentity } from "context/identity";
import { NetworkStatus } from "apollo-client";
// import { doScheduleNotification } from "../../context/happiness/notification";
import { useData } from "./useData";
import Slide, { styles as slidesStyles } from "./Slide";
import { slideGutter, slideWidth } from "./constants";

export type Navigation = CompositeNavigationProp<
  NavigationProp<TabParamList, "kolbeh">,
  StackNavigationProp<HomeStackParamList>
>;

const HappinessTraining = () => {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();

  const {
    state: { name },
  } = useIdentity();

  const {
    error,
    loading,
    networkStatus,
    categoryToTryNext,
    categories,
    rawCategories,
  } = useData();

  const scrollViewRef = useRef<ScrollView>(null);
  const slidesX = useRef<Record<string, number>>({});
  const jumpToCategory = useCallback(() => {
    function helper() {
      if (categoryToTryNext.nextOne === undefined) {
        return;
      }

      const x = slidesX.current[categoryToTryNext.nextOne.id];
      if (x) {
        scrollViewRef.current?.scrollTo({
          x: x - 24,
          animated: false,
        });
      }
    }
    setTimeout(() => {
      helper();
    }, 50);
    helper();
  }, [categoryToTryNext]);

  useFocusEffect(jumpToCategory);
  useEffect(jumpToCategory, [loading, jumpToCategory]);

  const header = (
    <View style={styles.greetingContainer}>
      {categoryToTryNext.state !== "not-now" ? (
        <FormattedText style={styles.greeting}>
          <Trans i18nKey="happiness.greeting.hello" values={{ name }}>
            <FormattedText style={styles.greeting} />
          </Trans>
        </FormattedText>
      ) : null}
      {categoryToTryNext.state === "all-done" ? (
        <FormattedText style={styles.greeting}>
          <Trans i18nKey="happiness.greeting.allDone">
            <FormattedText style={styles.greetingCategory} />
          </Trans>
        </FormattedText>
      ) : categoryToTryNext.state === "not-now" ? (
        <FormattedText style={styles.greeting}>
          <Trans
            style={styles.greeting}
            values={{ name }}
            i18nKey="happiness.greeting.enoughForToday"
          >
            <FormattedText style={styles.name} />
          </Trans>
        </FormattedText>
      ) : categoryToTryNext.nextOne !== undefined ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("happinessCategory", {
              category: categoryToTryNext.nextOne!,
            })
          }
        >
          <FormattedText style={styles.greeting}>
            <Trans
              i18nKey="happiness.greeting.tryNow"
              values={{ title: categoryToTryNext?.nextOne?.title ?? "" }}
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
        ref={scrollViewRef}
      >
        {loading && rawCategories?.length === 0 ? (
          <View style={[slidesStyles.container, { left: -28 }]}>
            <Loading />
          </View>
        ) : (
          rawCategories?.map((category) => {
            const state = categories[category.id]?.state;

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
        {/* <TouchableOpacity
          onPress={() => {
            const at = new Date(Date.now() + 1000);
            doScheduleNotification(at, "بفرست این رو");
          }}
          style={{ height: 44, paddingHorizontal: 10, borderWidth: 1 }}
        >
          <FormattedText>notify</FormattedText>
        </TouchableOpacity> */}
        {rawCategories.length === 0 && error ? (
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
  name: {
    fontSize: 20,
    color: colors.primary,
    lineHeight: 18 * 1.8,
  },
  greetingCategory: { color: colors[1] },
});

export default HappinessTraining;
