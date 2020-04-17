const sharp = require("sharp");

export async function optimize(match: string, optimizedName: string) {
  const stream = sharp(match);
  await stream
    // .resize(MAX_WIDTH)
    .webp()
    .toFile(optimizedName);

}

