import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import { useHappiness } from "context/happiness";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import rewardCertificateImg from "assets/images/reward-certificate.png";
import { Header } from "../settings/index";
import { Trans } from "react-i18next";

const fullWidth = Dimensions.get("window").width - 16 * 2;
const size = fullWidth / 3 - 4 * 2;

function Profile() {
  const happiness = useHappiness();

  const ys = [14, 1, -3, 1, 14];
  const xs = [5, 5, 0, -5, -5];
  const categories = happiness.rawCategories.map((category) => {
    const exercises = category.exercises.map((exercise, index) => {
      const isDone = happiness.exercises[exercise.id].state === "done";
      return (
        <View
          style={{
            // paddingHorizontal: 2,
            position: "relative",
            top: -ys[index],
            right: xs[index],
          }}
        >
          <IconSvg
            name="star"
            size={(size - 2 * 2) / 7 - 2 * 2}
            color={isDone ? "#FFDC25" : "lightgrey"}
          />
        </View>
      );
    });

    return (
      <View
        style={{
          marginHorizontal: 3,
          width: size,
          height: size,
          alignItems: "center",
          paddingTop: 18,
        }}
      >
        <Icon
          name="medal"
          size={0}
          style={{
            position: "absolute",
            width: size,
            height: size,
          }}
        />
        <IconSvg
          name={`happinessToolbox-${category.id}`}
          size={size / 3}
          color={colors.greenVariant}
        />
        <View style={{ flexDirection: "row" }}>{exercises}</View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header />
      <View
        style={{
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {categories}
          {happiness.isAllDone() ? (
            <>
              <View style={{ flex: 1 }} />
              <View
                style={{
                  marginHorizontal: 3,
                  width: size,
                  height: size,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Certificate />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundVariant,
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    // borderWidth: 1,
    marginBottom: 16,
  },
  cloud1: { position: "absolute", bottom: 16, left: 16 },
  avatar: {
    borderWidth: 4,
    borderRadius: 500,
    margin: 10,
    padding: 10,
    borderColor: colors.secondary,
  },
  cloud2: { position: "absolute", top: 0, width: 80, right: 16 },
  row: { borderWidth: 0, flexGrow: 1 },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    height: 70,
  },
  itemTitle: {
    paddingHorizontal: 40,
    color: colors.primary,
    fontSize: 20,
  },
});

const Certificate = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={addIdeaStyles.modal}>
          <View style={addIdeaStyles.container}>
            <View style={addIdeaStyles.innerContainer}>
              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 36,
                  width: fullWidth - 36 * 2 - 130,
                  paddingTop: 16,
                }}
              >
                <View>
                  <IconSvg name="certificate" size={55} color="red" />
                </View>
                <FormattedText style={addIdeaStyles.text}>
                  <Trans
                    i18nKey="happiness.reward.allDone"
                    components={[<FormattedText style={addIdeaStyles.text} />]}
                  />
                </FormattedText>
              </View>
              <View style={addIdeaStyles.imageContainer}>
                <Image
                  source={rewardCertificateImg}
                  style={addIdeaStyles.image}
                  resizeMode="contain"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: "center", position: "absolute", bottom: 24 }}
            >
              <IconSvg name="tickOutline" size="small" color="#00DE76" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <IconSvg name="certificate" size={80} color="red" />
      </TouchableOpacity>
    </>
  );
};

const addIdeaStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryThird,
  },
  container: {
    width: fullWidth - 2 * 36,
    // marginHorizontal: 36,
    borderRadius: 25,
    minHeight: fullWidth / 2,
    backgroundColor: colors.backgroundVariant,
    // paddingVertical: 16,
    // borderWidth: 3,
    // alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    // marginBottom: 16,
  },
  text: {
    // paddingLeft: 16,
    paddingTop: 16,
    fontSize: 18,
    lineHeight: 18 * 1.8,
    color: colors.primary,
    // borderWidth: 2,
    // borderColor: "green",
  },
  imageContainer: {
    // position: "absolute",
    right: -20,
    top: -20,
    // borderWidth: 1,
  },
  image: { width: 130, height: 130 * 2, borderWidth: 0 },
});

export default Profile;
