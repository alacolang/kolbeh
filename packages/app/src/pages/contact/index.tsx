import React from "react";
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import { IconSvg } from "components/icon";
import { getCodePushVersion } from "utils/codepush";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

const Contact = () => {
  const { data } = useQuery(GET_INFO);
  const info = data ? data.info : {};
  const [codepushVersion, setCodepushVersion] = React.useState({
    pushVersion: "na",
    appVersion: "na",
  });

  React.useEffect(() => {
    async function helper() {
      const result = await getCodePushVersion();
      setCodepushVersion({
        pushVersion: result.label,
        appVersion: result.version,
      });
    }
    helper();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.backgroundPrimaryThird,
        flex: 1,
        paddingHorizontal: 36 + 16,
        justifyContent: "center",
      }}
    >
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
        <TouchableOpacity onPress={() => Linking.openURL("https://t.me/IACAP")}>
          <View style={styles.socialIconContainer}>
            <IconSvg name="telegram" size="tiny" color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.version}>api version: {info.version || "-"}</Text>
        <Text style={styles.version}>
          push version: {codepushVersion.pushVersion}
        </Text>
        <Text style={styles.version}>
          app version: {codepushVersion.appVersion}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: "#f0f0f0",
    fontSize: 12,
  },
});

export default Contact;
