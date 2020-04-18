import React from "react";
import {
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/main-feed";
import colors from "../colors";
import { Icon } from "../components/icon";
import Contact from "../pages/contact";

export type HomeStackParamList = {
  home: undefined;
  contact: undefined;
};
const Stack = createStackNavigator<HomeStackParamList>();

const Header = () => {
  const [header, setHeader] = React.useState(true);
  return <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setHeader(!header);
          }}
        >
          {!header ? (
            <View style={styles.iconContainer}>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon name="backActive" size={20} resizeMode="contain" />
            </View>
          )}
        </TouchableOpacity>
        {header && (
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0,
              width: 180,
              justifyContent: "space-evenly",
            }}
          >
            <Icon name="save" size="tiny" />
            <Icon name="shareActive" size="tiny" />
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("contact");
              }}
            >
              <Icon name="info" size="tiny" />
            </TouchableOpacity>
          </View>
        )}
      </View>
}

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen
        name="contact"
        component={Contact}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};



const styles = StyleSheet.create({
  header: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // marginTop: 10,
    paddingHorizontal: 30,
    marginHorizontal: -10,
    marginTop: -2,
    height: 57,
    // borderWidth: 1,
    // borderColor: "red",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: colors.primaryVarient,
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,

    // elevation: 7,
  },
  iconDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 1.5,
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    paddingBottom: 30,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.background,
  },
});

export default ParentNavigator;
