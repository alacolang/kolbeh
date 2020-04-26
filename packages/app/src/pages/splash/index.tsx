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
// import { StackParamList } from "../../navigation/home-stack-navigator";
import colors from "../../colors";
import icons, { Icon } from "../../components/icon";
import * as Types from "../../types";

import AsyncStorage from "@react-native-community/async-storage";
// import { persistCache } from "apollo-cache-persist";
import { cache } from "../../index";

const GET_PROMOTIONS = gql`
  query {
    promotions {
      id
      description
    }
  }
`;

type Navigation = NavigationProp<StackParamList, "splash">;

/*
splash
main
  home
    home
    contact
    post
  parent
    parentCategoryList
    parentFeed
    post
  child
*/

type PromotionsData = {
  promotions: Types.IPromotion[];
};

const Splash = () => {
  const navigation = useNavigation<Navigation>();
  const { data, loading, refetch, error } = useQuery<PromotionsData>(
    GET_PROMOTIONS
  );

  const [promotions, setPromotions] = React.useState<Types.IPromotion[]>([]);

  React.useEffect(() => {
    async function restorePromotions() {
      const raw = await AsyncStorage.getItem("promotions");
      if (!raw) return;
      try {
        const promotions = JSON.parse(raw);
        // console.log(promotions[0]);
        setPromotions(promotions);
      } catch (e) {}
    }
    restorePromotions();
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!loading && data && data.promotions) {
      // console.log({ loading, data: JSON.stringify(data, null, 2) });
      AsyncStorage.setItem("promotions", JSON.stringify(data.promotions));
    }
  }, [data, loading]);

  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        borderColor: "black",
      }}
    >
      <StatusBar hidden />

      <View
        style={{
          flex: 1,
          borderWidth: 1,
          // zIndex: 0,
          backgroundColor: colors.background,
          borderBottomStartRadius: 40,
          borderBottomEndRadius: 40,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          {promotions.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch((state) => {
                  // console.log(JSON.stringify(state));
                  const action =  CommonActions.navigate({
                    name: 'main',
                    params: {
                      screen: 'home',
                      params: {
                        screen: 'post',
                        params: {
                          id: data.promotions[0].id
                        }
                      }
                    }
                  })

                  console.log({action})
                  return action

                });
                // navigation.navigate("main", {
                //   screen: "home",
                //   id: promotions[0].id,
                // });
                // navigation.dispatch(
                //   CommonActions.reset({
                //     index: 0,
                //     routes: [
                //       {
                //         name: "main",
                //       },
                //     ],
                //   })
                // );
              }}
            >
              <View style={styles.textContainer}>
                <FormattedText style={styles.promotionText}>
                  {promotions[0].description}
                </FormattedText>

                <View
                  style={{ alignContent: "flex-end", alignSelf: "flex-end" }}
                >
                  <Icon name="leftArrow" size="tiny" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {!loading && promotions.length === 0 && (
            <View style={styles.textContainer}>
              <FormattedText style={styles.text} id="home.information" />
            </View>
          )}
          <View style={styles.logoContainer}>
            <Image
              source={icons.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </View>
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
              fill={colors.inactive}
              clipPath="url(#cut-off-bottom)"
            />
          </Svg>
        </View>
        <View
          style={{
            paddingBottom: 50,
            // borderWidth: 1
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.reset({ index: 0, routes: [{ name: "main" }] });
            }}
            activeOpacity={0.5}
            style={{
              width: 60,
              position: "relative",
              top: -20,
              height: 60,
              borderRadius: 60,
              justifyContent: "center",
              alignItems: "center",
              // borderWidth: 3,
              borderColor: "red",
              backgroundColor: colors.childCategory2,
            }}
          >
            <FormattedText
              id="enter"
              style={{ color: "white", fontSize: 18 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: (fullHeight / 3) * 2,
    backgroundColor: colors.inactive,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    // borderWidth: 5,
    paddingHorizontal: 40,
    borderColor: "blue",
    // paddingTop: 30,
    zIndex: 100,
  },
  textContainer: {
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
    // justifyContent: "center",
    // alignItems: "center",
  },
  logo: { width: 60, height: 60 },
});

export default Splash;
