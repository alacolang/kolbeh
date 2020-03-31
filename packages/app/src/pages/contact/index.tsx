import React from "react";
import {
  Image,
  Linking,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";
import icons from "../../icons";
import { getVersion } from "../../utils/codepush";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

const Contact = () => {
  const { data, loading, error } = useQuery(GET_INFO);
  const info = data ? data.info : {};
  const [codepushVersion, setCodepushVersion] = React.useState({
    label: "na",
    version: "na",
  });

  React.useEffect(() => {
    async function helper() {
      const codepushVersion = await getVersion();
      setCodepushVersion(codepushVersion);
    }
    helper();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <View style={styles.information}>
        <View style={styles.outerCircle}></View>
        <View style={styles.circle}></View>
        <View style={styles.row}>
          <FormattedText
            style={styles.content}
            id="contact.title"
          ></FormattedText>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL("tel:+982155409495")}>
          <View style={styles.row}>
            <FormattedText style={styles.content} id="contact.tel" />
            <FormattedText style={styles.content} id="contact.telnumber" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("http://iacap.ir/")}
        >
          <Text style={styles.content}>iacap.ir</Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://twitter.com/iacap_ir")}
          >
            <View style={styles.socialIconContainer}>
              <Image
                source={icons.twitter}
                resizeMode="contain"
                style={styles.socialIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.instagram.com/iacap2")}
          >
            <View style={styles.socialIconContainer}>
              <Image
                source={icons.instagram}
                resizeMode="contain"
                style={styles.socialIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://t.me/IACAP")}
          >
            <View style={styles.socialIconContainer}>
              <Image
                source={icons.telegram}
                resizeMode="contain"
                style={styles.socialIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.logo}>
          <Image
            source={icons.contact}
            resizeMode="contain"
            style={{ width: 60, height: 60 }}
          />
        </View> */}
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.version}>api version: {info.version || "-"}</Text>
        <Text style={styles.version}>
          push version: {`${codepushVersion.label}--${codepushVersion.version}`}
        </Text>
      </View>
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
  socialContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  socialIconContainer: {
    marginHorizontal: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  row: {
    height: 44,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  versionContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  version: {
    color: "#c0c0c0",
    fontSize: 12,
  },
});

export default Contact;
