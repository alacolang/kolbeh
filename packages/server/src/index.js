import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";

const app = express();
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "static")));

const dataSources = () => {
  return {};
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => error,
  dataSources,
  //   introspection: true,
  //   playground: true,
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
