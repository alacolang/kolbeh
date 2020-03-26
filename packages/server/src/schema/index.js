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

  type Post {
    id: ID!
    imageUrl: String!
    title: String!
  }
`;

export default schema;
