import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

type IConnectivityContext = State;
const initialState: State = {
  isInternetReachable: false,
  isConnected: false,
};
const ConnectivityContext = React.createContext<IConnectivityContext>(
  initialState
);

type State = {
  isInternetReachable: boolean;
  isConnected: boolean;
};

export function ConnectivityProvider<T>(props: T) {
  const [state, setState] = useState<State>(initialState);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      setState({
        isConnected: netState.isConnected,
        isInternetReachable: Boolean(netState.isInternetReachable),
      });
    });
    return unsubscribe;
  }, []);
  return <ConnectivityContext.Provider {...props} value={state} />;
}

export function useConnectivity() {
  const context = React.useContext(ConnectivityContext);

  return context;
}
