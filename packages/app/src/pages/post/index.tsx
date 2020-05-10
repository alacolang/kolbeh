import React from "react";
import { View, StatusBar } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/core";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ParentStackParamList } from "../../navigation/parent-stack-navigator";
import * as Types from "../../types";
import MarkdownPost from "./markdown-post";
import ImagePost from "./image-post";
import VideoPost from "./video-post";
import colors from "../../colors";
import InAppPost from "../../components/body-percussion";

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

  return (
    <View
      style={{
        flex: 1,
        // paddingHorizontal: 15,
        // backgroundColor: stuff.type === "video" ? "black" : colors.background,
      }}
    >
      <StatusBar hidden />
      <Component post={stuff} />
    </View>
  );
};

export default PostScreen;
