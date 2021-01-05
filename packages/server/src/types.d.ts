export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type Category = {
  __typename?: "Category";
  id: Scalars["ID"];
  title: Scalars["String"];
  shortDescription?: Maybe<Scalars["String"]>;
  description: Scalars["String"];
  icon: Scalars["String"];
  feed: FeedConnection;
  order?: Maybe<Scalars["Int"]>;
};

export type Exercise = {
  __typename?: "Exercise";
  id: Scalars["String"];
  title: Scalars["String"];
  description: Scalars["String"];
  order: Scalars["Int"];
  post?: Maybe<Post>;
};

export type FeedConnection = {
  __typename?: "FeedConnection";
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type HappinessTraining = {
  __typename?: "HappinessTraining";
  categories: Array<Maybe<HappinessTrainingCategory>>;
  onboarding?: Maybe<Array<Maybe<Slide>>>;
};

export type HappinessTrainingCategory = {
  __typename?: "HappinessTrainingCategory";
  id: Scalars["ID"];
  title: Scalars["String"];
  description: Scalars["String"];
  about?: Maybe<Scalars["String"]>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  image: Image;
  post?: Maybe<Post>;
};

export type Image = {
  __typename?: "Image";
  id: Scalars["ID"];
  url: Scalars["String"];
};

export type Info = {
  __typename?: "Info";
  version?: Maybe<Scalars["String"]>;
};

export type Markdown = {
  __typename?: "Markdown";
  content: Scalars["String"];
  cover?: Maybe<Scalars["String"]>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasNextPage: Scalars["Boolean"];
  endCursor?: Maybe<Scalars["String"]>;
};

export type ParentFeedConnection = {
  __typename?: "ParentFeedConnection";
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type Post = {
  __typename?: "Post";
  id: Scalars["ID"];
  description?: Maybe<Scalars["String"]>;
  title: Scalars["String"];
  category: Scalars["String"];
  images: Array<Maybe<Image>>;
  videos: Array<Maybe<Video>>;
  markdown?: Maybe<Markdown>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  type: PostType;
  date?: Maybe<Scalars["Date"]>;
  order?: Maybe<Scalars["Int"]>;
};

export type PostEdge = {
  __typename?: "PostEdge";
  node?: Maybe<Post>;
};

export enum PostType {
  Image = "image",
  Video = "video",
  Markdown = "markdown",
  Inapp = "inapp",
}

export type Promotion = {
  __typename?: "Promotion";
  id: Scalars["ID"];
  description: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  info?: Maybe<Info>;
  postById?: Maybe<Post>;
  parentCategories: Array<Category>;
  posts: ParentFeedConnection;
  childCategories: Array<Category>;
  categoryById: Category;
  /** @deprecated use parentCategories */
  parentFeed: ParentFeedConnection;
  /** @deprecated use childCategories */
  childFeed: ParentFeedConnection;
  promotions: Array<Promotion>;
  happinessTraining: HappinessTraining;
};

export type QueryPostByIdArgs = {
  id: Scalars["ID"];
};

export type QueryParentCategoriesArgs = {
  types?: Maybe<Array<Maybe<PostType>>>;
};

export type QueryPostsArgs = {
  types?: Maybe<Array<Maybe<PostType>>>;
};

export type QueryChildCategoriesArgs = {
  types?: Maybe<Array<Maybe<PostType>>>;
};

export type QueryCategoryByIdArgs = {
  id: Scalars["ID"];
};

export type QueryPromotionsArgs = {
  types?: Maybe<Array<Maybe<PostType>>>;
};

export type Slide = {
  __typename?: "Slide";
  title: Scalars["String"];
  image: Image;
};

export type Video = {
  __typename?: "Video";
  id: Scalars["ID"];
  url: Scalars["String"];
  cover?: Maybe<Scalars["String"]>;
};
