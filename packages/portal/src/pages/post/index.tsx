import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import styled from "styled-components";
import Loading from "../../components/loading";
import * as Types from "../../types";

function Images({ images }: { images: Types.IImage[] }) {
  return (
    <div>
      {images.map((image) => (
        <Image src={"http://localhost:8000" + image.url} />
      ))}
    </div>
  );
}

function Videos({ videos }: { videos: Types.IVideo[] }) {
  return (
    <div>
      <Image src={"http://localhost:8000" + videos[0].cover} />
    </div>
  );
}

const Image = styled.img`
  display: inline-block;
  width: 100px;
  /* height: 200px; */
  padding: 10px;
`;

const GET_POST = gql`
  query GetPost($ID: ID!) {
    postByID(id: $ID) {
      id
      title
      category
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

type PostData = {
  postByID: Types.IPost;
};

function Post() {
  let { slug } = useParams();
  const postID = slug;
  const { data, loading, error } = useQuery<PostData>(GET_POST, {
    variables: { ID: postID },
  });

  if (loading) return <Loading />;
  if (error) return <div>failed to load feed!</div>;
  if (!data) return <div>feed empty</div>;

  const post = data.postByID;

  let images = null;
  let videos = null;

  if (post.images.length > 0) {
    images = <Images images={post.images} />;
  }
  if (post.videos.length > 0) {
    videos = <Videos videos={post.videos} />;
  }
  return (
    <>
      <Title>{post.title}</Title>
      <h2>#{post.category}</h2>
      <div>{images}</div>
      <div>{videos}</div>
    </>
  );
}

const Title = styled.h1`
  display: block;
  text-align: center;
`;

export default Post;
