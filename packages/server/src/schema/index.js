import { gql } from "apollo-server-express";

const schema = gql`
  type Query {
    info: Info
  }

  type Info {
    version: String
  }
`

export default schema;