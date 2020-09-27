import React from "react";
import {
  Linking,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  View,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { IconSvg } from "components/icon";
import { getVersion } from "utils/codepush";
import ContactImg from "assets/images/contact-character.png";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

const HEADER_MIN_HEIGHT = 60;

const Contact = ({ navigation }) => {
  // const navigation = useNavigation<FeedNavigation>();
  const { data } = useQuery(GET_INFO);
  const info = data ? data.info : {};
  const [codepushVersion, setCodepushVersion] = React.useState({
    label: "na",
    version: "na",
  });

  React.useEffect(() => {
    async function helper() {
      setCodepushVersion(await getVersion());
    }
    helper();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.green,
        flex: 1,
        paddingHorizontal: 36,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          // borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 40,
        }}
      >
        <IconSvg
          name="cloud"
          color="white"
          size="medium"
          style={{ position: "relative", top: 30 }}
        />
        <IconSvg
          name="cloud"
          color="white"
          size="huge"
          style={{ position: "relative", top: -10 }}
        />
      </View>
      <View style={{ paddingHorizontal: 40 }}>
        <FormattedText style={styles.text} id="contact.title" />
        <TouchableOpacity onPress={() => Linking.openURL("tel:+982155409495")}>
          <View style={styles.row}>
            <FormattedText style={styles.text} id="contact.tel" />
            <FormattedText style={styles.text} id="contact.telnumber" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL("http://iacap.ir/")}
        >
          <Text style={styles.text}>iacap.ir</Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://twitter.com/iacap_ir")}
          >
            <View style={styles.socialIconContainer}>
              <IconSvg name="twitter" size="tiny" color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.instagram.com/iacap2")}
          >
            <View style={styles.socialIconContainer}>
              <IconSvg name="instagram" size="tiny" color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://t.me/IACAP")}
          >
            <View style={styles.socialIconContainer}>
              <IconSvg name="telegram" size="tiny" color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ position: "absolute", bottom: 80, right: 10,  }}>
        <Image
          source={ContactImg}
          style={{ width: 120, height: 300 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.version}>api version: {info.version || "-"}</Text>
        <Text style={styles.version}>
          push version: {codepushVersion.label}
        </Text>
        <Text style={styles.version}>
          app version: {codepushVersion.version}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 30,
  },
  text: {
    fontSize: 18,
    color: "white",
    lineHeight: 2 * 18,
    textAlign: "center",
  },
  socialContainer: {
    marginBottom: 30,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 40,
    zIndex: 1,
  },
  socialIconContainer: {
    paddingTop: 20,
    marginHorizontal: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.green
  },
  row: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  versionContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 40,
    right: 10,
  },
  version: {
    color: colors.primary,
    fontSize: 12,
  },
});

export default Contact;
