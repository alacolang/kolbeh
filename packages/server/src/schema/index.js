import { gql } from "apollo-server-express";

// parent > category > post (pagination)
// child > category > post (pagination)

const schema = gql`
  type Query {
    info: Info @cacheControl(maxAge: 1000)
    postById(id: ID!): Post
    parentCategories(types: [PostType]): [Category!]! @cacheControl(maxAge: 240)
    posts(types: [PostType]): ParentFeedConnection!
    childCategories(types: [PostType]): [Category!]! @cacheControl(maxAge: 240)
    categoryById(id: ID!): Category!
    parentFeed: ParentFeedConnection!
      @deprecated(reason: "use parentCategories")
    childFeed: ParentFeedConnection! @deprecated(reason: "use childCategories")
    promotions(types: [PostType]): [Promotion!]!
    happinessTraining: HappinessTraining!
  }

  type HappinessTraining {
    categories: [HappinessTrainingCategory]!
    onboarding: [Slide]
  }

  type Slide {
    title: String!
    image: Image!
  }

  type HappinessTrainingCategory {
    id: ID!
    title: String!
    description: String!
    about: String
    exercises: [Exercise]
    image: Image!
    post: Post
  }

  type Exercise {
    id: String!
    title: String!
    description: String!
    order: Int!
    post: Post
  }

  type Category {
    id: ID!
    title: String!
    description: String!
    icon: String!
    feed: FeedConnection!
    order: Int
  }

  type Info {
    version: String
  }

  type PostEdge {
    node: Post
  }

  type ParentFeedConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  type FeedConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Image {
    id: ID!
    url: String!
  }

  type Video {
    id: ID!
    url: String!
    cover: String
  }

  type Markdown {
    content: String!
    cover: String
  }

  type Post {
    id: ID!
    description: String
    title: String!
    category: String!
    images: [Image]!
    videos: [Video]!
    markdown: Markdown
    tags: [String]
    type: PostType!
    date: Date
    order: Int
  }

  scalar Date

  enum PostType {
    image
    video
    markdown
    inapp
  }

  type Promotion {
    id: ID!
    description: String!
  }
`;

export default schema;
