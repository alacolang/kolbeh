import ParentActiveIcon from "./images/parent-active.png";
import ParentIcon from "./images/parent.png";
import ChildIcon from "./images/child.png";
import ChildActiveIcon from "./images/child-active.png";
import HomeIcon from "./images/home.png";
import HomeActiveIcon from "./images/home-active.png";
import BackIcon from "./images/back.png";
import LogoIcon from "./images/logo.png";
import { ImageSourcePropType } from "react-native";
import EmpathyActiveIcon from "./images/empathy-active.png";
import GriefActiveIcon from "./images/grief-active.png";
import StressActiveIcon from "./images/stress-active.png";
import DepressionActiveIcon from "./images/depression-active.png";
import ObsessionActiveIcon from "./images/obsession-active.png";
import EducationActiveIcon from "./images/education-active.png";
import AdhdActiveIcon from "./images/adhd-active.png";
import AutismActiveIcon from "./images/autism-active.png";
import BipolarActiveIcon from "./images/bipolar-active.png";
import ParentingActiveIcon from "./images/parenting-active.png";
import KidIcon from "./images/kid.png";
import TeenIcon from "./images/teen.png";
import InstagramIcon from "./images/instagram.png";
import TwitterIcon from "./images/twitter.png";
import TelegramIcon from "./images/telegram.png";

type Icons = Record<string, ImageSourcePropType>;

const icons: Icons = {
  parent: ParentIcon,
  parentActive: ParentActiveIcon,
  child: ChildIcon,
  childActive: ChildActiveIcon,
  home: HomeIcon,
  homeActive: HomeActiveIcon,
  back: BackIcon,
  logo: LogoIcon,
  empathyActive: EmpathyActiveIcon,
  griefActive: GriefActiveIcon,
  stressActive: StressActiveIcon,
  depressionActive: DepressionActiveIcon,
  obsessionActive: ObsessionActiveIcon,
  educationActive: EducationActiveIcon,
  adhdActive: AdhdActiveIcon,
  autismActive: AutismActiveIcon,
  bipolarActive: BipolarActiveIcon,
  parentingActive: ParentingActiveIcon,
  kid: KidIcon,
  teen: TeenIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
};

export default icons;
