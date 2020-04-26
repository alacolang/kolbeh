import React from "react";
import {
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import { CommonActions } from "@react-navigation/native";
import gql from "graphql-tag";
import { FormattedText } from "../../components/formatted-text";
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import { StackParamList } from "../../navigation/splash-stack-navigator";
import colors from "../../colors";
import { Icon } from "../../components/icon";
import * as Types from "../../types";

import AsyncStorage from "@react-native-community/async-storage";
// import { persistCache } from "apollo-cache-persist";

const GET_PROMOTIONS = gql`
  query {
    promotions {
      id
      description
    }
  }
`;

type Navigation = NavigationProp<StackParamList, "splash">;

type PromotionsData = {
  promotions: Types.IPromotion[];
};

const Splash = () => {
  const navigation = useNavigation<Navigation>();
  const { data, loading, refetch, error } = useQuery<PromotionsData>(
    GET_PROMOTIONS
  );

  const [promotion, setPromotion] = React.useState<
    Types.IPromotion | undefined
  >(undefined);

  React.useEffect(() => {
    async function restorePromotions() {
      const raw = await AsyncStorage.getItem("promotions");
      if (!raw) return;
      try {
        const promotion = getRandomPromotion(JSON.parse(raw));
        setPromotion(promotion);
      } catch (e) {}
    }
    restorePromotions();
  }, []);

  React.useEffect(() => {
    if (!loading && data && data.promotions) {
      AsyncStorage.setItem("promotions", JSON.stringify(data.promotions));
      // AsyncStorage.removeItem("promotions")
    }
  }, [data, loading]);

  const getRandomPromotion = (promotions: Types.IPromotion[]) => {
    return promotions[Math.floor(Math.random() * promotions.length)];
  };

  const handlePromotionClick = () => {
    if (!data) return;
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: "main",
            state: {
              routes: [
                {
                  name: "home",
                  state: {
                    index: 1,
                    routes: [
                      { name: "feed" },
                      { name: "post", params: { id: promotion!.id } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  };

  const handleEnter = () => {
    navigation.reset({ index: 0, routes: [{ name: "main" }] });
  };

  const borderRendered = (
    <View
      style={{
        // borderWidth: 1,
        position: "relative",
        top: -35,
      }}
    >
      <Svg
        height={120}
        width={fullWidth}
        // viewBox="0 0 360 281"
      >
        <Defs>
          <ClipPath id="cut-off-bottom">
            <Rect x="0" y="35" width={fullWidth} height="120" />
          </ClipPath>
        </Defs>

        <Path
          d="M-10.1111 1.78645H349.889C349.889 1.78645 422.889 -19.2135 349.889 82.7865C276.889 184.786 108.889 -51.2135 -10.1111 82.7865C-129.111 216.786 -10.1111 1.78645 -10.1111 1.78645Z"
          fill={colors.backgroundVarient}
          clipPath="url(#cut-off-bottom)"
        />
      </Svg>
    </View>
  );

  const logoRendered = (
    <View style={styles.logoContainer}>
      <Icon name="logo" size="large" />
    </View>
  );

  let content = null;

  if (promotion) {
    content = (
      <TouchableOpacity onPress={() => handlePromotionClick()}>
        <>
          <FormattedText style={styles.promotionText}>
            {promotion.description + '...'}
          </FormattedText>

          <View style={{ alignContent: "flex-end", alignSelf: "flex-end" }}>
            <Icon name="leftArrow" size="tiny" />
          </View>
        </>
      </TouchableOpacity>
    );
  } else {
    if (!loading) {
      content = <FormattedText style={styles.text} id="home.information" />;
    }
  }

  return (
    <>
      <StatusBar hidden />
      <View style={styles.blackBackground}>
        <View style={styles.roundedContainer}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>{content}</View>
            {logoRendered}
          </View>
          {borderRendered}
          <TouchableOpacity
            onPress={() => handleEnter()}
            activeOpacity={0.5}
            style={styles.enterContainer}
          >
            <FormattedText id="enter" style={styles.enterButton} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  blackBackground: {
    flex: 1,
    backgroundColor: "black",
  },
  roundedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: (fullHeight / 3) * 2,
    width: fullWidth,
    backgroundColor: colors.backgroundVarient,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 40,
    zIndex: 100,
  },
  contentContainer: {
    paddingTop: 120 - 35,
    flex: 1,
    // borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  promotionText: {
    fontSize: 18,
    color: colors.secondary,
    lineHeight: 2 * 18,
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    color: colors.secondary,
    lineHeight: 2 * 24,
    textAlign: "center",
  },
  logoContainer: {
    position: "relative",
    top: 20,
    alignSelf: "flex-start",
    // borderRadius: 44,
    height: 60,
    width: 60,
  },
  enterContainer: {
    position: "relative",
    top: -20,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 3,
    borderColor: "red",
    backgroundColor: colors.childCategory2,
  },
  enterButton: { color: "white", position: "relative", top: -2, fontSize: 18 },
});

export default Splash;
