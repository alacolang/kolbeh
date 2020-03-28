import { gql } from "apollo-server-express";

const schema = gql`
  type Query {
    info: Info
    parentFeed: ParentFeedConnection!
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

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Image {
    url: String!
  }

  type Video {
    url: String!
    cover: String
  }

  type Post {
    id: ID!
    category: String!
    images: [Image]!,
    videos: [Video]!,
    title: String!
  }
`;

export default schema;
