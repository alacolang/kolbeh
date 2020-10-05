import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps, Platform } from "react-native";
// import messages from "utils/localize/fa";
const messages = {};
const MessagesContext = React.createContext(messages);

const MessagesProvider: React.FC = (props) => {
  return (
    <MessagesContext.Provider value={messages}>
      {props}
    </MessagesContext.Provider>
  );
};

type Props = {
  id?: string;
};
const FormattedText: React.FC<TextProps & Props> = ({
  style,
  id,
  ...props
}) => {
  const { t } = useTranslation();
  if (id) {
    return (
      <Text style={[styles.persian, style]} {...props}>
        {t(id)}
      </Text>
    );
  } else {
    return <Text style={[styles.persian, style]} {...props} />;
  }
};

export { MessagesProvider, FormattedText };

const styles = StyleSheet.create({
  persian: {
    fontFamily: "IRANYekanRDMobile",
    textAlign: "left",
    paddingTop: Platform.OS === "ios" ? 7 : 2,
  },
});

// export default MyText;
