import { IconName } from "../components/icon";

export type IImage = {
  id: string;
  url: string;
};

export type IVideo = {
  id: string;
  url: string;
  cover: string;
};

export type IMarkdown = {
  content: string;
  cover: string;
};

type ID = string & { _type: "PostID" }; // type branding!

export type IPost = {
  id: ID;
  title: string;
  category: string;
  images: IImage[];
  videos: IVideo[];
  tags: ITag[];
  markdown: IMarkdown;
  type: IPostType;
};

export type ITag = string;

export type ICategory = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: IconName;
  feed: IFeed;
};

export type IFeed = {
  edges: IPostEdge[];
  pageInfo: IPageInfo;
};

export type IPostEdge = {
  node: IPost;
};

export type IPageInfo = {
  hasNextPage: boolean;
  endCursor: string;
};

export type IPromotion = {
  id: string;
  description: string;
};

export enum IPostType {
  image = "image",
  video = "video",
  markdown = "markdown",
  inapp = "inapp",
}

export type ICategories = ICategory[];

export type IHappinessTraining = {
  categories: IHappinessTrainingCategory[];
  onboarding: ISlide[];
};

export type ISlide = {
  title: string;
  image: IImage;
};

export type IHappinessTrainingCategory = {
  id: ID;
  title: string;
  description: string;
  about: string;
  image: IImage;
  exercises: IExercise[];
  // post: IPost;
};

export type IExercise = {
  id: string;
  title: string;
  order: number;
  description: string;
  post?: IPost;
};
