import React from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Post from "./post";

const GET_FEED = gql`
  query GetFeed {
    parentFeed {
      edges {
        title
        image
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export type IPost = {
  title: String;
  image: String;
};

const ParentFeed = () => {
  const { data, loading, error } = useQuery(GET_FEED);
  const feed: IPost[] = data ? data.parentFeed.edges : {};
  console.log({ feed });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {feed.map((post) => (
        <Post post={post} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});

export default ParentFeed;
