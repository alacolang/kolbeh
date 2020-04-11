import React from "react";
import {
  TouchableHighlight,
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
import Icons from "../../components/icon";
import * as Types from "../../types";

const frameWidth = Dimensions.get("window").width - 30 * 2;

type IProps = {
  images: Types.IImage[];
  track: () => void;
};
type ISize = { width?: number; height: number };

const TheImage = ({ images, track }: IProps) => {
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
            <Image {...props} style={[props.style, styles.image]} />
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
        <TouchableHighlight
          style={styles.backContainer}
          onPress={() => setModalVisible(false)}
        >
          <Image source={Icons.back} resizeMode="contain" style={styles.back} />
        </TouchableHighlight>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          track();
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
  },
  count: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
  },
  image: { borderRadius: 10 },
  backContainer: {
    position: 'absolute',
    top: 4,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    width: 24,
    height: 24,
  },
});

export default TheImage;
