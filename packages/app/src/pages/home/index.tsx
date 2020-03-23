import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_INFO = gql`
  query GetInfo {
    info {
      version
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(GET_INFO);
  const info = data ? data.info : {};
  return (
    <View style={styles.container}>
      <Text style={styles.header}>home</Text>
      <Text>version: {info.version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  header: {
    fontSize: 46,
  },
});

export default Home;
