const pLimit = require("p-limit");
const sharp = require("sharp");
const glob = require("glob");
// const fs = require("fs-extra");
const matches = glob.sync("src/static/images/**/*.{png,jpg,jpeg}");
// const matches = [
//   'src/static/images/masturbation-cover.png',
//   'src/static/images/parastooha-chap2-1.png'
// ]
const MAX_WIDTH_LOW = 150;
// const QUALITY = 85;

const limit = pLimit(5);

const newExt = ".webp";

async function doProcess() {
  console.log("optimizing images...");
  await Promise.all(
    matches.slice(0, 10).map(async (match) => {
      const stream = sharp(match);
      // const info = await stream.metadata();
      // if (info.width < MAX_WIDTH) {
      //   return;
      // }
      const optimizedName = match.replace(
        /(\..+)$/,
        (match, ext) => `${newExt}`
      );
      const lowName = match.replace(
        /(\..+)$/,
        (match, ext) => `-${MAX_WIDTH_LOW}${newExt}`
      );
      limit(() => stream.webp().toFile(optimizedName));
      limit(() => stream.resize(MAX_WIDTH_LOW).webp().toFile(lowName));
      // return fs.rename(optimizedName, newName);
    })
  );

  console.log("optimizing images...done");
}

doProcess();
