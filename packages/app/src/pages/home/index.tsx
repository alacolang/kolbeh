import React from "react";
import {
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";
import icons from "../../icons";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(GET_INFO);
  const info = data ? data.info : {};
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background}
        barStyle="dark-content"
      />

      <View style={styles.information}>
        <View style={styles.outerCircle}></View>
        <View style={styles.circle}></View>
        <FormattedText style={styles.content} id="home.information" />
        <View style={styles.logo}>
          <Image source={icons.logo} style={{ width: 35, height: 35 }} />
        </View>
        <TouchableOpacity style={styles.more} onPress={() => {}}>
          <FormattedText style={styles.moreContent} id="contactus" />
        </TouchableOpacity>
      </View>
      {/* <Text>version: {info.version}</Text> */}
    </View>
  );
};

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.background,
  },
  information: {
    backgroundColor: "white",
    borderRadius: 10,
    width: width - 30 * 2,
    // height: width - 30 * 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 45,
  },
  content: {
    fontSize: 18,
    color: colors.primary,
    lineHeight: 2 * 18,
    // borderWidth: 1,
    textAlign: "justify",
  },
  logo: {
    alignSelf: "flex-end",
    // borderWidth: 1,
    marginBottom: 30,
  },
  outerCircle: {
    position: "absolute",
    left: -2,
    top: -2,
    borderRadius: 20,
    width: 20,
    height: 20,
    backgroundColor: colors.background,
  },
  circle: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 16,
    width: 16,
    height: 16,
    backgroundColor: colors.orange,
  },
  more: {
    borderRadius: 30,
    backgroundColor: colors.orange,
    height: 30,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  moreContent: {
    color: "white",
  },
});

export default Home;
