const sharp = require("sharp");
const glob = require("glob");
// const fs = require("fs-extra");
const matches = glob.sync("src/static/images/**/*.{png,jpg,jpeg}");
// const MAX_WIDTH = 1800;
// const QUALITY = 85;

const newExt = ".webp";

Promise.all(
  matches.map(async (match) => {
    const stream = sharp(match);
    // const info = await stream.metadata();
    // if (info.width < MAX_WIDTH) {
    //   return;
    // }
    const optimizedName = match.replace(
      /(\..+)$/,
      (match, ext) => `${newExt}`
    );
    await stream
      // .resize(MAX_WIDTH)
      .webp()
      .toFile(optimizedName);

    // return fs.rename(optimizedName, newName);
  })
);
