import React, { useEffect } from "react";

import AsyncStorage from "@react-native-community/async-storage";
import config from "config";

const IDENTITY_KEY = "identity";

const noop = () => {};

type State = {
  userId: string;
  name: string | undefined;
};

const initialState = {
  userId: "",
  name: undefined,
};

type IIdentityContext = {
  state: State;
  updateName: (name: string) => void;
};

const IdentityContext = React.createContext<IIdentityContext>({
  state: initialState,
  updateName: noop,
});

function guidGenerator(): string {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

let _userId: string | undefined;

export async function saveToDatabase(
  userId: string,
  data: Record<string, any>
) {
  const extendedData = { ...data, userId };
  const url = config.HOST + "/api/users";
  console.log("saveToDatabase", { url, extendedData });
  await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: { token: `kolbeh-${userId}`, "Content-Type": "application/json" },
    body: JSON.stringify(extendedData),
  });
}

export const IdentityProvider = <T extends {}>(props: T) => {
  const [state, setState] = React.useState<State>(initialState);

  const update = async (updated: State) => {
    console.log("update called", { updated, state });
    if (JSON.stringify(updated) !== JSON.stringify(state)) {
      await AsyncStorage.setItem(IDENTITY_KEY, JSON.stringify(updated));
      await saveToDatabase(updated.userId, updated);
      setState(updated);
    }
  };

  useEffect(() => {
    async function readFromStorage() {
      const storedState = await AsyncStorage.getItem(IDENTITY_KEY);
      try {
        const parsedStoreState = JSON.parse(storedState!);
        console.log({ parsedStoreState });
        if (parsedStoreState.userId?.length > 0) {
          update(parsedStoreState);
        } else {
          const userId = guidGenerator();
          update({ ...initialState, userId });
        }
      } catch (e) {}
    }
    readFromStorage();
  }, []);

  return (
    <IdentityContext.Provider
      {...props}
      value={{
        state,
        updateName: (name: string) => update({ ...state, name }),
      }}
    />
  );
};

export const useIdentity = () => {
  return React.useContext(IdentityContext);
};
