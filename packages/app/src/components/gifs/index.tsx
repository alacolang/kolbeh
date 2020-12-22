import img1 from "../../assets/images/1.gif";
import img2 from "../../assets/images/2.gif";
import img3 from "../../assets/images/3.gif";
import selfCompassion from "../../assets/images/self-compassion.gif";
import resilience from "../../assets/images/resilience.gif";
import kindness from "../../assets/images/kindness.gif";
import empathy from "../../assets/images/empathy.gif";
import connection from "../../assets/images/connection.gif";
import optimism from "../../assets/images/optimism.gif";
import mindfulness from "../../assets/images/mindfulness.gif";
import { ImageSourcePropType } from "react-native";

export const Gifs: Record<any, ImageSourcePropType> = {
  "self-compassion": selfCompassion,
  compassion: empathy,
  resilience,
  gratitude: img3,
  kindness,
  empathy,
  connection,
  optimism,
  awe: img1,
  mindfulness,
  forgiveness: img2,
};
