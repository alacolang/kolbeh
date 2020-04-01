import React from "react";
import {
  Dimensions,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { FormattedText } from "../../components/formatted-text";
import colors from "../../colors";
import config from "../../config";

const frameWidth = Dimensions.get("window").width - 30 * 2;

const TheImage = ({ image }: { image: { url: string } }) => {
  const [size, setSize] = React.useState<{ width?: number; height: number }>({
    width: frameWidth,
    height: 200,
  });
  const [modalVisible, setModalVisible] = React.useState(false);
  const uri = config.HOST + image.url;

  console.log({
    uri: uri,
    size,
  });

  React.useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        setSize({ height: (frameWidth / width) * height });
      },
      () => {}
    );
  }, [uri]);

  return (
    <View style={{}}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        presentationStyle="overFullScreen"
      >
        <StatusBar
          backgroundColor={colors.background}
          barStyle="light-content"
        />
        <ImageViewer
          backgroundColor={colors.background}
          renderImage={(props) => (
            <Image {...props} style={[props.style, { borderRadius: 10 }]} />
          )}
          renderIndicator={(currentIndex, allSize) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 10,
                left: 0,
                right: 0,
              }}
            >
              <FormattedText
                style={{
                  color: colors.primary,
                }}
              >
                {currentIndex!.toLocaleString("fa-IR") +
                  "/" +
                  allSize!.toLocaleString("fa-IR")}
              </FormattedText>
            </View>
          )}
          imageUrls={[{ url: uri }, { url: uri }]}
        />
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Image
          style={[styles.container, size]}
          source={{ uri }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modelContainer: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: frameWidth,
    borderWidth: 5,
    borderColor: "white",
  },
});

export default TheImage;
