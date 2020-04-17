import React from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";
import { Link } from "react-router-dom";
import gql from "graphql-tag";

import * as Types from "../../types";

const GET_PARENT = gql`
  query GetParent {
    parentCategories {
      id
      title
      description
      icon
    }
  }
`;

type ParentCategoriesData = {
  parentCategories: Types.ICategories;
};

function Parent() {
  const { data, loading, error } = useQuery<ParentCategoriesData>(GET_PARENT);

  if (!data) return null;

  return (
    <div>
      {data.parentCategories.map((category) => (
        <Item>
          <Link to={`/feed/${category.id}`}>{category.title}</Link>
        </Item>
      ))}
    </div>
  );
  // return null
}

const Item = styled.li`
  list-style: none;
  text-align: center;
  padding: 10px;
`

export default Parent;
