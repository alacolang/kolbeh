export const codePush = require("react-native-code-push");

const options = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};

const getVersion = () => {
  return codePush
    .getUpdateMetadata()
    .then((metadata: { label: any; appVersion: any; description: any }) => {
      return {
        label: metadata.label,
        version: metadata.appVersion,
        description: metadata.description,
      };
    })
    .catch(() => {
      // console.log("codepush error:", e);
      return {
        label: "na",
        version: "na",
      };
    });
};

let codePushify: Function;
if (process.env.NODE_ENV === "production") {
  codePushify = codePush(options);
} else {
  codePushify = (x: any) => x;
}

export { getVersion, codePushify };
