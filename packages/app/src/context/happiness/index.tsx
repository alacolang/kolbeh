import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

const KEY = "happiness";

type ID = string;

type IHappinessContext = [
  ID[],
  {
    finishExercise: (id: ID) => void;
  }
];

const HappinessContext = React.createContext<IHappinessContext>([
  [],
  {
    finishExercise: () => Promise.resolve([]),
  },
]);

export const HappinessProvider = <T extends {}>(props: T) => {
  const [exercises, setExercises] = React.useState<ID[]>([]);

  const updateExercises = async (updatedExercises: ID[]) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(updatedExercises));
    setExercises(updatedExercises);
    // return updatedBookmarkedPosts;
  };

  const addToBookmarkedPosts = (id: ID) => {
    const updatedBookmarkedPosts = Array.from(new Set([id, ...exercises]));
    updateExercises(updatedBookmarkedPosts);
  };

  React.useEffect(() => {
    async function readFromStorage() {
      const raw = await AsyncStorage.getItem(KEY);
      try {
        if (raw) {
          setExercises(JSON.parse(raw));
        }
      } catch (e) {}
    }
    readFromStorage();
  }, [exercises]);

  return (
    <HappinessContext.Provider
      {...props}
      value={[
        exercises,
        { finishExercise: addToBookmarkedPosts, removeFromBookmarkedPosts },
      ]}
    />
  );
};

export const useBookmarkedPosts = () => {
  const BookmarkedPosts = React.useContext(HappinessContext);
  return BookmarkedPosts;
};
