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

  type Post {
    id: ID!
    category: String!
    images: [Image]!,
    title: String!
  }
`;

export default schema;
