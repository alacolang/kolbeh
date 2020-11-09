import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { trackEvent } from "utils/analytics";

const KEY = "saved-posts";

type ID = string; // & { _type: "PostID" }; // type branding!

type IBookmarkedPostsContext = [
  ID[],
  {
    addToBookmarkedPosts: (id: ID) => void;
    removeFromBookmarkedPosts: (id: ID) => void;
  }
];

const BookmarkedPostsContext = React.createContext<IBookmarkedPostsContext>([
  [],
  {
    addToBookmarkedPosts: () => Promise.resolve([]),
    removeFromBookmarkedPosts: () => Promise.resolve([]),
  },
]);

export const BookmarkedPostsProvider = <T extends {}>(props: T) => {
  const [posts, setPosts] = React.useState<ID[]>([]);

  const updateBookmarkedPosts = async (updatedBookmarkedPosts: ID[]) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(updatedBookmarkedPosts));
    setPosts(updatedBookmarkedPosts);
    // return updatedBookmarkedPosts;
  };

  const addToBookmarkedPosts = (id: ID) => {
    const updatedBookmarkedPosts = Array.from(new Set([id, ...posts]));
    trackEvent("bookmark", { id });
    updateBookmarkedPosts(updatedBookmarkedPosts);
  };

  const removeFromBookmarkedPosts = (id: ID) => {
    const index = posts.findIndex((postID: ID) => postID === id);

    const updatedBookmarkedPosts = [
      ...posts.slice(0, index),
      ...posts.slice(index + 1),
    ];
    updateBookmarkedPosts(updatedBookmarkedPosts);
  };

  React.useEffect(() => {
    async function readFromStorage() {
      const raw = await AsyncStorage.getItem(KEY);
      try {
        if (raw) {
          setPosts(JSON.parse(raw));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

  return (
    <BookmarkedPostsContext.Provider
      {...props}
      value={[posts, { addToBookmarkedPosts, removeFromBookmarkedPosts }]}
    />
  );
};

export const useBookmarkedPosts = () => {
  const BookmarkedPosts = React.useContext(BookmarkedPostsContext);
  return BookmarkedPosts;
};
