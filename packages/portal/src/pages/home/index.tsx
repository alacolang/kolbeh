import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

function Block() {
  const { data, loading, error } = useQuery(GET_INFO);

  const info = data ? data.info : {};

  return <div>version: {info.version}</div>;
}

export default Block;
