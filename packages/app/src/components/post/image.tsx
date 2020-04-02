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
import { FormattedText } from "../formatted-text";
import colors from "../../colors";
import config from "../../config";
import * as Types from "../../types";

const frameWidth = Dimensions.get("window").width - 30 * 2;

type IProps = {
  images: Types.IImage[];
};
type ISize = { width?: number; height: number };

const TheImage = ({ images }: IProps) => {
  const [size, setSize] = React.useState<ISize>({
    width: frameWidth,
    height: 200,
  });
  const [modalVisible, setModalVisible] = React.useState(false);
  const uri = config.HOST + images[0].url;

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
            <View style={styles.count}>
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
          imageUrls={images.map((image) => ({
            ...image,
            url: config.HOST + image.url,
          }))}
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
  count: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
  },
});

export default TheImage;
