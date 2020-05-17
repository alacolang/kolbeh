import React from "react";
import { Dimensions, StyleSheet, View, Image } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { FormattedText } from "components/formatted-text";
import colors from "colors";
import * as Types from "types";
import { resolveURL } from "utils/resolve";

const frameWidth = Dimensions.get("window").width - 40 * 2;
const frameHeight = Dimensions.get("window").height - 40;

type Props = {
  post: Types.IPost;
};

const ImagePost = ({ post }: Props) => {
  const { images } = post;

  const [height, setHeight] = React.useState<number>(frameWidth);

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
    <View style={styles.outerContainer}>
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
                  { bottom: (frameHeight - height) / 2 - 40 },
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
                          x === "o" ? colors.inactive : "lightgray",
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
    </View>
  );
};

const toLocaleNumber = (number?: number) => {
  if (!number) return "";
  return number.toString().split("").map(toChar).join("");
};

const toChar = (x: string) =>
  String.fromCharCode(x.charCodeAt(0) - "0".charCodeAt(0) + "۰".charCodeAt(0));

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
  },
  image: { borderRadius: 10, marginHorizontal: 0 },
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
    top: 5,
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

export default ImagePost;
