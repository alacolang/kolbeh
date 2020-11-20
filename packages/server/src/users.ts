import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { findByKey, findAll, set } from "./db";

const router = express.Router();
const adminRouter = express.Router();

const getUserKey = (req: Request) => path.join("user", getToken(req));

const getToken = (req: Request) => {
  const token = req.headers?.token;
  if (!token) return "";
  if (Array.isArray(token)) return token[0];
  return token;
};

function checkToken(req: Request, res: Response, next: NextFunction) {
  if (!getToken(req).startsWith("kolbeh-")) {
    return res.status(401).json({ error: "data format" });
  }
  next();
}

router.post("/", checkToken, async (req, res) => {
  const data = req.body ?? {};
  console.log("data=", data);
  console.log("token=", req.headers.token);

  const key = getUserKey(req);

  try {
    const stored = (await findByKey(key)) ?? {};
    await set(key, { ...stored, ...data });
    res.json({ status: "ok" });
  } catch (err) {
    console.log("err", { err });
    res.status(500).json({ error: "failed to save" });
  }
});

adminRouter.get("/", (req, res) =>
  findAll()
    .then((data) => res.json(data))
    .catch((e) => {
      console.error("failed, e=", e);
      res.status(500).json({ error: "failed" });
    })
);

export default { router, adminRouter };
