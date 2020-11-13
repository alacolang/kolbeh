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
      // console.log("Connection type", netState.type);
      // console.log("Is connected?", netState.isConnected);
      // console.log("isInternetReachable	", netState.isInternetReachable);
      setState({
        isConnected: netState.isConnected,
        isInternetReachable: Boolean(netState.isInternetReachable),
        // isConnected: true,
        // isInternetReachable: false,
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
