// fdsdfsf <reference path="../../typings/custom/hello.d.ts" />

import ParentActiveIcon from "./images/parent-active.png";
import ParentIcon from "./images/parent.png";
import KidIcon from "./images/kid.png";
import KidActiveIcon from "./images/kid-active.png";
import HomeIcon from "./images/home.png";
import HomeActiveIcon from "./images/home-active.png";
import BackIcon from "./images/back.png";
import ClipIcon from "./images/clip-active.png";
import { ImageSourcePropType } from "react-native";

type Icons = Record<string, ImageSourcePropType>;

const icons: Icons = {
  parent: ParentIcon,
  parentActive: ParentActiveIcon,
  kid: KidIcon,
  kidActive: KidActiveIcon,
  home: HomeIcon,
  homeActive: HomeActiveIcon,
  back: BackIcon,
  clip: ClipIcon,
};

export default icons;
