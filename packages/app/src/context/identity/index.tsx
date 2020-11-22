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

export async function readFromStorage() {
  const storedState = await get<State>(IDENTITY_KEY);
  if (!storedState) {
    return initialState;
  }
  return storedState;
}

function guidGenerator(): string {
  const S4 = function () {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  // prettier-ignore
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export const IdentityProvider = (props: {
  children: React.ReactNode;
  initialData: State;
}) => {
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
    async function init() {
      try {
        if (props.initialData.userId) {
          userId = props.initialData.userId;
        } else {
          userId = guidGenerator();
        }
        doUpdate({ ...initialState, ...props.initialData, userId });
        await initSync();
      } catch (e) {
        console.warn("init identity failed");
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
