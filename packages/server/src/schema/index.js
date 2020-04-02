import { gql } from "apollo-server-express";

// parent > category > post (pagination)
// child > category > post (pagination)

const schema = gql`
  type Query {
    info: Info
    parentCategories: [Category!]!
    childCategories: [Category!]!
  }

  type Category {
    id: ID!
    title: String!
    icon: String!
    feed: FeedConnection!
  }

  type Info {
    version: String
  }

  type PostEdge {
    node: Post
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

  type Post {
    id: ID!
    description: String,
    title: String!,
    category: String!
    images: [Image]!,
    videos: [Video]!,
  }
`;

export default schema;
