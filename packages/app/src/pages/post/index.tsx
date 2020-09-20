import React from "react";
import { View, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/core";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ParentStackParamList } from "navigation/parent-stack-navigator";
import * as Types from "types";
import MarkdownPost from "./markdown-post";
import ImagePost from "./image-post";
import VideoPost from "./video-post";
import Unknown from "./unkown-post";
import { Icon } from "components/icon";
import { useBookmarkedPosts } from "context/bookmark-posts";
import InAppPost from "components/body-percussion";

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

const PostScreen = () => {
  const [
    bookmarkedPosts,
    { addToBookmarkedPosts, removeFromBookmarkedPosts },
  ] = useBookmarkedPosts();
  const route = useRoute<PostRoute>();
  const { post, id } = route.params;

  let _post;
  if (post) {
    _post = post;
  }

  const { data } = useQuery<PostData>(GET_POST, {
    variables: {
      kooft: id,
    },
    skip: !id || !!post?.id,
  });

  if (id && data) {
    _post = data.postById;
  }

  if (!_post) {
    return null;
  }

  const _id = id ?? _post.id;

  const Component = {
    inapp: InAppPost,
    image: ImagePost,
    video: VideoPost,
    markdown: MarkdownPost,
  }[_post.type];

  if (!Component) {
    return <Unknown />;
  }

  const isSaved = bookmarkedPosts.includes(_id);

  const saveButtonRendered = (
    <TouchableOpacity
      style={styles.saveContainer}
      onPress={() => {
        if (!isSaved) {
          addToBookmarkedPosts(_id);
        } else {
          removeFromBookmarkedPosts(_id);
        }
      }}
    >
      <Icon name={isSaved ? "saveActive" : "save"} size="small" />
    </TouchableOpacity>
  );

  const NO_SAVE_TYPES: Types.IPostType[] = [];
  const canSave = !NO_SAVE_TYPES.includes(_post.type);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {canSave && <View style={styles.saveWrapper}>{saveButtonRendered}</View>}
      <Component post={_post} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveWrapper: {
    position: "absolute",
    alignItems: "center",
    top: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 10,
    paddingHorizontal: 30,
    // borderWidth: 1,
    // borderColor: "red",
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
