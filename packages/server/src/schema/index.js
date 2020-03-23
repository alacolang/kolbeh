import { gql } from "apollo-server-express";

const schema = gql`
  type Query {
    info: Info
    parentFeed: ParentFeedConnection!
  }

  type Info {
    version: String
  }

  type ParentFeedConnection {
    edges: [Post!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Post {
    id: ID!
    image: String!
    title: String!
  }
`;

export default schema;
