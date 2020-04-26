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

export type IPost = {
  id: string;
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
  description: string;
  icon: string;
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

export enum IPostType {
  image = "image",
  video = "video",
  markdown = "markdown",
}

export type ICategories = ICategory[];
