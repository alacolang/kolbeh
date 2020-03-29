export const codePush = require("react-native-code-push");

const options = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
};

export const codePushify = codePush(options);