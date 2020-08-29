import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  Easing,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Keyboard,
  FlatList,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "components/loading";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { Icon } from "components/icon";
import * as Types from "types";
import { errorReport } from "utils/error-reporter";
import Post from "components/feed-tile";
import { StackParamList } from "navigation/home-stack-navigator";
import { onShare } from "utils/share";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaConsumer } from "react-native-safe-area-context";

const fullHeight = Dimensions.get("window").height;
const fullWidth = Dimensions.get("window").width;

const GET_HAPPINESS_TRAININGS = gql`
  query {
    happinessTraining {
      categories {
        id
        title
        exercises {
          id
          title
        }
      }
    }
  }
`;

type HappinessTrainingData = {
  happinessTraining: Types.IHappinessTraining;
};

type Navigation = NavigationProp<StackParamList, "feed">;

const HappinessTraining = () => {
  // const navigation = useNavigation<Navigation>();

  const { data, loading } = useQuery<HappinessTrainingData>(
    GET_HAPPINESS_TRAININGS,
    {}
  );

  const categories = data?.happinessTraining.categories;

  console.log({categories})

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' , borderWidth: 1 }}>
      <View style={styles.container}>
        {/* <StatusBar hidden /> */}
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {categories?.map((category) => (
            <View
              key={category.id}
              style={{
                alignItems: "center",
                paddingBottom: 30,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  width: fullWidth / 2.5,
                  height: fullWidth / 2.5,
                  borderRadius: fullWidth,
                  borderWidth: 1,
                }}
              ></View>
              <Text>{category.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HappinessTraining;
