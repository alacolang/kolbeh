import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import { ApolloServer } from "apollo-server-express";
// import responseCachePlugin from "apollo-server-plugin-response-cache";
import bodyParser from "body-parser";
import morgan from "morgan";
import schema from "./schema";
import resolvers from "./resolvers";
// import logger from "./plugins/logger";
import { admin } from "./firebase-config";
import usersRouter from "./users";
import basicAuth from "express-basic-auth";
import { UI } from "bull-board";
import "./messaging/setup-ui";
import config from "./config";

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
  // plugins: [responseCachePlugin()],
  engine: {
    // reportSchema: true,
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

app.use("/api/users", usersRouter.router);

app.post("/api/error", (req, res) => {
  console.log("error", req.body);
  res.json({ status: "ok" });
});

app.use(
  basicAuth({
    users: { [config.admin.username]: config.admin.password },
    challenge: true,
  })
);

app.use("/admin/queues", UI);
app.use("/admin/api/users", usersRouter.adminRouter);
app.get("/admin/api/firebase/check", (req, res) => {
  const TOKEN =
    "fBuM63GmTaGzGyIONMtsoZ:APA91bFrmLbx6DcNq12XeQHyinXhpNQ-oqaTnPpnckUVoe1AWiLQ6ZkGzIr8LyyyC8AHxVubF6WSVHYqbF1eDsk5ztH3t0wZq9XLrvJe7SnJiHUQ2bngCMRmWnt9aYr3BH8yifp4kkUF";

  const name = "یاسر";
  const exercise = "ذهن آگاهی";

  const message = {
    token: TOKEN,
    notification: {
      body: "",
      title: `${name} شکلات رو امروز با ${exercise} مزه کن`,
      imageUrl:
        "http://192.168.178.40:8000/static/images/notification-icon.png",
    },
    data: {
      exerciseToTry: "awe",
    },
    android: {
      // Required for background/quit data-only messages on Android
      priority: "high",
    },
  } as const;

  admin.messaging().send(message);
  res.send("sent!");
});

const port = process.env.PORT || 8000;
app.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});
