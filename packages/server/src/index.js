import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import bodyParser from "body-parser";
import morgan from "morgan";
import schema from "./schema";
import resolvers from "./resolvers";
// import logger from "./plugins/logger";
import { admin } from "./firebase-config";

const app = express();
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "static")));

const dataSources = () => {
  return {};
};

const server = new ApolloServer({
  typeDefs: schema,
  // mocks: true,
  resolvers,
  plugins: [responseCachePlugin()],
  onHealthCheck: () => {
    return new Promise((resolve) => {
      resolve();
    });
  },
  engine: {
    reportSchema: true,
  },
  // formatError: (error) => error,
  // dataSources,
  // plugins: [logger],
  // context: (params) => () => {
  //   console.log("query---", params.req.body.query);
  //   // console.log(params.req.body.variables);
  // },
  //   introspection: true,
  playground: process.env.NODE_ENV !== "production",
});

server.applyMiddleware({ app, path: "/graphql" });

app.use(morgan("combined"));

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/firebase/check", (req, res) => {
  const TOKEN =
    "dwctybyXR_a9DrJx9f7CJQ:APA91bGBkGv4i4QDIM-sZwcPc0b74g37w1UPT8P_I89Z5LaaOAuIAk8DZbIs7LPt8UyyVnQbiZkR27SQy-eFH1PfCgA3fUb4BLsIZktfKlo6-tnCvFBKittlQw-gSZBB4H1qJn9hwpH0";

  const message = {
    token: TOKEN,
    notification: {
      body: "از بک‌اند",
      title: "مشقت انجام بده",
    },
    data: {
      exerciseToTry: "awe",
    },
    android: {
      // Required for background/quit data-only messages on Android
      priority: "high",
    },
  };

  admin.messaging().send(message);
  res.send("sent!");
});

app.post("/api/error", (req, res) => {
  console.log("error", req.body);
  res.json({ status: "ok" });
});

const port = process.env.PORT || 8000;
app.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
