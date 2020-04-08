import { gql } from "apollo-server-express";

// parent > category > post (pagination)
// child > category > post (pagination)

const schema = gql`
  type Query {
    info: Info @cacheControl(maxAge: 1000)
    postById(id: ID!): Post!
    parentCategories: [Category!]! @cacheControl(maxAge: 240)
    childCategories: [Category!]! @cacheControl(maxAge: 240)
    parentFeed: ParentFeedConnection!
      @deprecated(reason: "use parentCategories")
    childFeed: ParentFeedConnection! @deprecated(reason: "use childCategories")
  }

  type Category {
    id: ID!
    title: String!
    description: String!
    icon: String!
    feed: FeedConnection!
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
  }
`;

export default schema;
