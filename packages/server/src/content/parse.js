const { readFile, writeFileSync } = require("fs");
const util = require("util");
const md5 = require("md5");
const marked = require("marked");
const { basename } = require("path");
const glob = require("glob");
const fm = require("front-matter");
const R = require("ramda");
const x = __dirname + "/posts/**/*.md";

const matches = glob.sync(x);
const readFileAsync = util.promisify(readFile);


function parse() {
  let result = { parent: {}, child: {} };
  return Promise.all(
    matches.map(async (match) => {
      const fileContent = await readFileAsync(match, "utf8");

      let images = [];
      let videos = [];
      let markdown;

      let parsedFileContent = fm(fileContent);

      function handleImageVideoPost() {
        const renderer = new marked.Renderer();
        renderer.image = (href, title, text) => {
          const url = href.replace('../../static/', '/static/')
          images.push({ url, id: md5(href) });
        };

        renderer.link = (href, title, text) => {
          const url = href.replace('../../static/', '/static/')
          videos.push({ url, id: md5(href), cover: images[0].url });
        };

        marked(parsedFileContent.body, { renderer });
      }

      const meta = parsedFileContent.attributes;
      const { type, category } = meta;

      handleImageVideoPost();
      if (type === "image" || type == "video") {
      } else if (type === "markdown") {
        markdown = { content: parsedFileContent.body, cover: images[0].url };
        images = [images[0]];
        videos = [];
      }

      const keyPath = category.split("/");

      if (!R.hasPath(keyPath, result)) {
        result = R.assocPath(keyPath, { feed: [] }, result);
      }

      if (type === "category") {
        result = R.assocPath(
          keyPath,
          { ...R.path(keyPath, result), ...meta, id: meta.category },
          result
        );
      } else {
        meta.id = `${category}:${basename(match)}`;
        meta.images = videos.length > 0 ? [] : images;
        meta.videos = videos;
        meta.markdown = markdown;
        meta.category = keyPath[1];
        R.path(keyPath, result).feed.push(meta);
      }
    })
  ).then(() => {
    result.parent = Object.values(result.parent).sort(
      (a, b) => a.order - b.order
    );
    result.parent = result.parent.map((category) => {
      category.feed.sort((a, b) => a.order - b.order);
      return category;
    });
    result.child = Object.values(result.child).sort(
      (a, b) => a.order - b.order
    );
    result.child = result.child.map((category) => {
      category.feed.sort((a, b) => a.order - b.order);
      return category;
    });
    // console.log("result=", JSON.stringify(result, null, 2));
    // writeFileSync("data.json", JSON.stringify(result, null, 2));
    return result;
  });
}

parse();
console.log("done");

module.exports = parse;
