import React from "react";
import {
  Linking,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";
import { Icon } from "../../components/icon";
import { getVersion } from "../../utils/codepush";
import Curve from "../../components/curve";

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
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          // activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backContainer}>
            <Icon name="back" size="tiny" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <Icon name="info" size="small" />
        <Curve position="bottom-right" negative />
        <Curve position="bottom-left" negative />
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
              <Icon name="twitter" size="tiny" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.instagram.com/iacap2")}
          >
            <View style={styles.socialIconContainer}>
              <Icon name="instagram" size="tiny" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://t.me/IACAP")}
          >
            <View style={styles.socialIconContainer}>
              <Icon name="telegram" size="tiny" />
            </View>
          </TouchableOpacity>
        </View>
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
    color: colors.primary,
    lineHeight: 2 * 18,
    textAlign: "center",
  },
  socialContainer: {
    marginBottom: 30,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-evenly",
  },
  socialIconContainer: {
    paddingTop: 20,
    marginHorizontal: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    bottom: 10,
    right: 10,
  },
  version: {
    color: colors.primary,
    fontSize: 12,
  },
  logoContainer: {
    borderWidth: 1,
  },
  headerContainer: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: colors.backgroundVarient,
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
    borderColor: "red",
  },
});

export default Contact;
