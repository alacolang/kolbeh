import express from "express";
import path from "path";
import { findByKey, findAll, set } from "./db";

const router = express.Router();

const getUserKey = (req) => path.join("user", req.headers.token);

router.get("/", (req, res) =>
  findAll()
    .then((data) => res.json(data))
    .catch((e) => {
      console.error("failed, e=", e);
      res.status(500).json({ error: "failed" });
    })
);

router.post("/", async (req, res) => {
  const data = req.body;
  console.log("data=", data);
  console.log("token=", req.headers.token);

  if (!data || !req.headers || !req.headers.token.startsWith("kolbeh-")) {
    return res.status(401).json({ error: "data format" });
  }
  const key = getUserKey(req);

  try {
    const stored = (await findByKey(key)) ?? {};
    await set(key, { ...stored, ...data });
    res.json({ status: "ok" });
  } catch (e) {
    console.log("err", { err });
    res.status(500).json({ error: "failed to save" });
  }
});

module.exports = router;
