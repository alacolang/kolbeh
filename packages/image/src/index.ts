import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { optimize } from "./image";

// const imageFilter = function(req, file, cb) {
//   // accept image only
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../", "static/images"));
  },

  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let uploadSingle = multer({
  storage,
  // fileFilter: imageFilter
}).single("image");

let app = express();
app.use(cors());

app.use("/static", express.static(path.join(__dirname, "../", "static")));

app.use(morgan("common"));

app.get("/version", (req, res) => {
  res.send("0.0.1");
});

app.post("/upload/image", uploadSingle, function(
  req: Request & { file: { filename: string } },
  res: Response,
  next
) {
  console.log("saved as", req.file);
  let path = `/static/images/${req.file.filename}`;
  let optimizePath = `/static/images/${req.file.filename.replace(
    /(\w+)\.(.*)$/,
    "$1.webp"
  )}`;
  console.log({ path, optimizePath });
  // optimize();
  res.json({
    status: "ok",
    url: `${process.env.HOST}${path}`,
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log("listening on " + port);
});
