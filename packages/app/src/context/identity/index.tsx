import React, { useEffect } from "react";
import { initSync, sync } from "context/sync";
import { get, set } from "utils/storage";

const IDENTITY_KEY = "identity";

const noop = () => {};

let userId: string | undefined;

export function getUserId() {
  return userId;
}

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

export const IdentityProvider = <T extends {}>(props: T) => {
  const [state, setState] = React.useState<State>(initialState);

  const update = (updated: State) => {
    if (JSON.stringify(updated) !== JSON.stringify(state)) {
      doUpdate(updated);
    }
  };

  const doUpdate = async (updated: State) => {
    try {
      set(IDENTITY_KEY, updated);
      sync(updated);
      setState(updated);
    } catch (e) {
      console.warn("failed to update", e);
    }
  };

  useEffect(() => {
    async function readFromStorage() {
      const storedState = await get<State>(IDENTITY_KEY);

      try {
        if (storedState?.userId) {
          userId = storedState.userId;
          doUpdate(storedState);
        } else {
          const _userId = guidGenerator();
          userId = _userId;
          doUpdate({ ...initialState, userId: _userId });
        }
        await initSync();
      } catch (e) {
        console.warn("init identity failed");
      }
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
