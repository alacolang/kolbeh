import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

const KEY = "saved-posts";

type ID = string & { _type: "PostID" }; // type branding!

type ISavedPostsContext = [
  ID[],
  {
    addToSavedPosts: (id: ID) => Promise<ID[]>;
    removeFromSavedPosts: (id: ID) => Promise<ID[]>;
  }
];

const SavedPostsContext = React.createContext<ISavedPostsContext>([
  [],
  {
    addToSavedPosts: (id: ID) => Promise.resolve([]),
    removeFromSavedPosts: (id: ID) => Promise.resolve([]),
  },
]);

export const SavedPostsProvider = <T extends {}>(props: T) => {
  const [posts, setPosts] = React.useState<ID[]>([]);

  const updateSavedPosts = async (updatedSavedPosts: ID[]) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(updatedSavedPosts));
    setPosts(updatedSavedPosts);
    // return updatedSavedPosts;
  };

  const addToSavedPosts = (id: ID) => {
    console.log("addToSavedPosts", { id, posts });
    const updatedSavedPosts = Array.from(new Set([id, ...posts]));
    updateSavedPosts(updatedSavedPosts);
  };

  const removeFromSavedPosts = (id: ID) => {
    const index = posts.findIndex((postID: ID) => postID === id);

    const updatedSavedPosts = [
      ...posts.slice(0, index),
      ...posts.slice(index + 1),
    ];
    updateSavedPosts(updatedSavedPosts);
  };

  React.useEffect(() => {
    async function readFromStorage() {
      const raw = await AsyncStorage.getItem(KEY);
      console.log({ raw, posts });
      try {
        if (!!raw) {
          setPosts(JSON.parse(raw));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

  console.log("save provider:", { posts });
  return (
    <SavedPostsContext.Provider
      {...props}
      value={[posts, { addToSavedPosts, removeFromSavedPosts }]}
    />
  );
};

export const useSavedPosts = () => {
  const savedPosts = React.useContext(SavedPostsContext);
  return savedPosts;
};
