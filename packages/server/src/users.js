import express from "express";
import levelup from "levelup";
import leveldown from "leveldown";
import path from "path";

const db = levelup(leveldown("./db"));
const router = express.Router();

const getUserPath = (req) => path.join("user", req.headers.token);

const getUsers = () => {
  let users = {};
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on("data", function (data) {
        console.log(data.key.toString(), "=", data.value.toString());
        users[data.key.toString()] = JSON.parse(data.value.toString());
      })
      .on("error", function (err) {
        console.log("Oh my!", err);
        reject();
      })
      .on("close", function () {
        console.log("Stream closed");
      })
      .on("end", function () {
        console.log("Stream ended");
        resolve(users);
      });
  });
};

router.get("/", (req, res) =>
  getUsers()
    .then((data) => res.json(data))
    .catch(
      (e) =>
        console.error("faile, e=", e) ||
        res.status(500).json({ error: "failed" })
    )
);

const getValue = async (key, defaultValue) => {
  try {
    return JSON.parse(await db.get(key));
  } catch (e) {
    return defaultValue;
  }
};

router.post("/", async (req, res) => {
  const data = req.body;
  console.log("data=", data);
  console.log("token=", req.headers.token);

  if (!data || !req.headers || !req.headers.token.startsWith("kolbeh-"))
    return res.status(401).json({ error: "data format" });

  const key = getUserPath(req);
  const value = await getValue(key, {});

  db.put(key, JSON.stringify({ ...value, ...data }), (err) => {
    console.log("err", { err });
    return err
      ? res.status(500).json({ error: "failed to save" })
      : res.json({ status: "ok" });
  });
});

module.exports = router;
