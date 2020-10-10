import { Share } from "react-native";
import messages from "./localize/fa";

export const onShare = async () => {
  try {
    const result = await Share.share({
      message:
        messages["invite-others"] +
        "\n https://cafebazaar.ir/app/ir.alacolang.kolbeh",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {}
};
