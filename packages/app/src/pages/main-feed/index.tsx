import React from "react";
import {
  View,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Loading from "../../components/loading";
import colors from "../../colors";
import { Icon } from "../../components/icon";
import * as Types from "../../types";
import { errorReport } from "../../utils/error-reporter";
import Post from "../../components/post";
import { HomeStackParamList } from "../../navigation/home-stack-navigator";

const GET_POSTS = gql`
  query {
    posts {
      pageInfo {
        hasNextPage
      }
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
`;

type ParentCategoriesData = {
  posts: Types.IFeed;
};

type Navigation = NavigationProp<HomeStackParamList, "home">;

const ParentScreen = () => {
  const navigation = useNavigation<Navigation>();

  const [refreshing, setRefreshing] = React.useState(false);
  const [header, setHeader] = React.useState(true);
  const { data, loading, refetch, error } = useQuery<ParentCategoriesData>(
    GET_POSTS
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  if (error) {
    errorReport(error, { origin: "parent> get feed" });
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }
  const posts = data.posts;

  const renderItem = ({ item }: { item: Types.IPostEdge }) => {
    return <Post post={item} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setHeader(!header);
          }}
        >
          {!header ? (
            <View style={styles.iconContainer}>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
              <View style={styles.iconDot}></View>
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Icon name="backActive" size={20} resizeMode="contain" />
            </View>
          )}
        </TouchableOpacity>
        {header && (
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0,
              width: 180,
              justifyContent: "space-evenly",
            }}
          >
            <Icon name="save" size="tiny" />
            <Icon name="shareActive" size="tiny" />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("contact");
              }}
            >
              <Icon name="info" size="tiny" />
            </TouchableOpacity>
          </View>
        )}
      </View> */}
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={posts.edges}
        renderItem={renderItem}
        scrollEventThrottle={16}
        keyExtractor={(item: Types.IPostEdge) => item.node.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // marginTop: 10,
    paddingHorizontal: 30,
    height: 55,
    // borderWidth: 1,
    // borderColor: "red",
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: colors.primaryVarient,
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,

    // elevation: 7,
  },
  iconDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    margin: 1.5,
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    marginTop: 15,
    paddingBottom: 30,
    marginHorizontal: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.background,
  },
});

export default ParentScreen;
