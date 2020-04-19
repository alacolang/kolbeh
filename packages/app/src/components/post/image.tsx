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
import Icons from "../../components/icon";
import * as Types from "../../types";
import { resolveURL } from "../../utils/resolve";

const frameWidth = Dimensions.get("window").width - 40 * 2;
const frameHeight = Dimensions.get("window").height - 40;

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
  const [height, setHeight] = React.useState<number>(200);
  const [modalVisible, setModalVisible] = React.useState(false);
  const uri = resolveURL(images[0].url);

  React.useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        setSize({ height: (frameWidth / width) * height });
      },
      () => {}
    );
  }, [uri]);

  const imagesNumber = images.length;
  const MAX_DOTS = 5;

  const handleDots = (
    previousIndex = 0,
    currentIndex = 0,
    x = 0,
    y = Math.min(MAX_DOTS, imagesNumber - 1)
  ) => {
    let result = [];
    let k = x;
    while (k <= y) {
      result.push(k === currentIndex ? "o" : "*");
      k++;
    }
    let [_x, _y] = [x, y];
    if (currentIndex !== previousIndex) {
      if (currentIndex === y && y !== imagesNumber - 1) {
        _x = Math.min(x + 1, imagesNumber - 1);
        _y = Math.min(y + 1, imagesNumber - 1);
      } else if (currentIndex === x && x > 0) {
        _x = Math.max(0, x - 1);
        _y = Math.max(0, y - 1);
      }
    }
    if (imagesNumber - 1 > y) result.push(".");
    if (x > 0) result.unshift(".");
    return { previousIndex: currentIndex, x: _x, y: _y, result };
  };

  const [{ previousIndex, x, y, result }, setXY] = React.useState(
    handleDots(0)
  );

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
          renderImage={(props) => {
            setHeight(props.style.height);
            return <Image {...props} style={[props.style, styles.image]} />;
          }}
          onChange={(currentIndex) => {
            setXY(handleDots(previousIndex, currentIndex, x, y));
          }}
          renderIndicator={(currentIndex, allSize = 0) =>
            allSize <= 1 ? (
              <View />
            ) : (
              <>
                <View
                  style={[
                    styles.dotsContainer,
                    { bottom: (frameHeight - height) / 2 - 30 },
                  ]}
                >
                  {result.map((x, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          width: x === "." ? 3 : 7,
                          height: x === "." ? 3 : 7,
                          backgroundColor:
                            x === "o" ? colors.primary : "lightgray",
                        },
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.indexContainer}>
                  <FormattedText style={styles.index}>
                    {toLocaleNumber(allSize) +
                      " / " +
                      toLocaleNumber(currentIndex)}
                  </FormattedText>
                </View>
              </>
            )
          }
          imageUrls={images.map((image) => ({
            ...image,
            url: resolveURL(image.url),
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
    height: frameWidth,
  },
  image: { borderRadius: 10, marginHorizontal: 0 },
  backContainer: {
    position: "absolute",
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  dot: {
    borderRadius: 9,
    margin: 2,
  },
  indexContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
  },
  index: {
    borderRadius: 24,
    width: 60,
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
});

const toChar = (x: string) =>
  String.fromCharCode(x.charCodeAt(0) - "0".charCodeAt(0) + "۰".charCodeAt(0));

const toLocaleNumber = (number?: number) => {
  if (!number) return "";
  return number.toString().split("").map(toChar).join("");
};

export default TheImage;
