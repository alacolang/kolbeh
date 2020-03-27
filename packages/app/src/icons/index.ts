import ParentActiveIcon from "./images/parent-active.png";
import ParentIcon from "./images/parent.png";
import KidIcon from "./images/kid.png";
import KidActiveIcon from "./images/kid-active.png";
import HomeIcon from "./images/home.png";
import HomeActiveIcon from "./images/home-active.png";
import BackIcon from "./images/back.png";
import ClipIcon from "./images/clip-active.png";
import LogoIcon from "./images/logo.png";
import AnxietyIcon from "./images/empathy.png";
import ArrowIcon from "./images/arrow.png";
import { ImageSourcePropType } from "react-native";
import EmpathyIcon from "./images/empathy.png";
import GriefIcon from "./images/grief.png";
import StressIcon from "./images/stress.png";
import DepressionIcon from "./images/depression.png";
import ObsessionIcon from "./images/obsession.png";
import EducationIcon from "./images/education.png";
import AdhdIcon from "./images/adhd.png";
import AutismIcon from "./images/autism.png";
import BipolarIcon from "./images/bipolar.png";
import ParentingIcon from "./images/parenting.png";

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
  logo: LogoIcon,
  anxiety: AnxietyIcon,
  arrow: ArrowIcon,
  empathy: EmpathyIcon,
  grief: GriefIcon,
  stress: StressIcon,
  depression: DepressionIcon,
  obsession: ObsessionIcon,
  education: EducationIcon,
  adhd: AdhdIcon,
  autism: AutismIcon,
  bipolar: BipolarIcon,
  parenting: ParentingIcon,
};

export default icons;
