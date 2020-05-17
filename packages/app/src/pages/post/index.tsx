import React from "react";
import {
  View,
  StatusBar,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/core";
import Svg, { Path } from "react-native-svg";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import * as Types from "types";
import MarkdownPost from "./markdown-post";
import ImagePost from "./image-post";
import VideoPost from "./video-post";
import Unknown from "./unkown-post";
import colors from "colors";
import { Icon } from "components/icon";
import { useSavedPosts } from "context/saved-posts";
import InAppPost from "components/body-percussion";
import Curve from "components/curve";

const fullWidth = Dimensions.get("window").width;

export type PostRouteParam = {
  post?: Types.IPost;
  id?: string;
};

const GET_POST = gql`
  query PostById($kooft: ID!) {
    postById(id: $kooft) {
      id
      category
      tags
      type
      images {
        id
        url
      }
      videos {
        id
        url
        cover
      }
      markdown {
        content
        cover
      }
    }
  }
`;

type PostRoute = RouteProp<ParentStackParamList, "post">;

type PostData = {
  postById: Types.IPost;
};

const PostScreen = ({ navigation }) => {
  const [
    savedPosts,
    { addToSavedPosts, removeFromSavedPosts },
  ] = useSavedPosts();
  const route = useRoute<PostRoute>();
  const { post, id } = route.params;

  let stuff;
  if (post) {
    stuff = post;
  }

  const { data, error, loading } = useQuery<PostData>(GET_POST, {
    variables: {
      kooft: id,
    },
    skip: !id || !!(post && post.id),
  });

  if (id && data) {
    stuff = data.postById;
  }

  if (!stuff) return null;

  const Component = {
    inapp: InAppPost,
    image: ImagePost,
    video: VideoPost,
    markdown: MarkdownPost,
  }[stuff.type];

  if (!Component) {
    return <Unknown />;
  }

  const isSaved = savedPosts.includes(id);

  const saveButtonRendered = (
    <TouchableOpacity
      style={styles.saveContainer}
      onPress={() => {
        if (!isSaved) {
          addToSavedPosts(id);
        } else {
          removeFromSavedPosts(id);
        }
      }}
    >
      <Icon name={isSaved ? "saveActive" : "saved"} size="small" />
    </TouchableOpacity>
  );

  const curvesRendered = (
    <>
      <Curve
        position="bottom-right"
        negative
        backgroundColor={stuff.type === "video" ? "black" : undefined}
      />
      <Curve
        position="bottom-left"
        negative
        backgroundColor={stuff.type === "video" ? "black" : undefined}
      />
    </>
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backContainer}>
            <Icon name="back" size="tiny" />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {saveButtonRendered}
        {curvesRendered}
      </View>
      <StatusBar hidden />
      <Component post={stuff} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    // position: "absolute",
    alignItems: "center",
    // top: 0,
    flexDirection: "row",
    zIndex: 10,
    // paddingTop: 20,
    paddingHorizontal: 30,
    // borderWidth: 1,
    // borderColor: "black",
    height: 60,
    backgroundColor: colors.backgroundVarient,
  },
  backContainer: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 44,
  },
});

export default PostScreen;
