import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import Loading from "components/loading";
import Post from "components/post";

import * as Types from "types";

const GET_CATEGORY = gql`
  query GetFeed($ID: ID!) {
    categoryByID(id: $ID) {
      title
      description
      feed {
        edges {
          node {
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
      }
    }
  }
`;

type CategoryData = {
  categoryByID: Types.ICategory;
};

function Feed() {
  let { slug } = useParams();
  const categoryId = slug;
  const { data, loading, error } = useQuery<CategoryData>(GET_CATEGORY, {
    variables: { ID: categoryId },
  });

  if (loading) return <Loading />;
  if (error) return <div>failed to load feed!</div>;
  if (!data) return <div>feed empty</div>;

  const category = data.categoryByID;

  return (
    <div>
      <Title>{category.title}</Title>
      {category.feed.edges.map(({ node }) => (
        <Post post={node} />
      ))}
    </div>
  );
}

const Title = styled.h1`
  text-align: center;
`;

export default Feed;
