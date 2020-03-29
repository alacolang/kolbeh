export const codePush = require("react-native-code-push");

const options = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

export const getVersion = () => {
  return codePush
    .getUpdateMetadata()
    .then((metadata: { label: any; appVersion: any; description: any }) => {
      return {
        label: metadata.label,
        version: metadata.appVersion,
        description: metadata.description,
      };
    })
    .catch((e: any) => {
      console.log("codepush error:", e);
      return {
        label: "na",
        version: "na",
      };
    });
};

export const codePushify = codePush(options);
