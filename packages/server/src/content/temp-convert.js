const fs = require("fs");
const path = require("path");
const data = require("../resolvers/data/index");

const HOST = "https://alacolang.ir/kolbeh";
const OUT_DIR = path.join(__dirname, "posts");

data.parentData.map((d, categryIndex) => {
  createPage("parent", d, categryIndex);
});
data.childData.map((d, categryIndex) => {
  createPage("child", d, categryIndex);
});

function createPage(root, d, categryIndex) {
  d.feed.map((p, i) => {
    // console.log(p)
    const items = Array.isArray(p) ? p : [p];
    let content = [];
    let type;
    if (/\.mp4$/.test(items[0])) {
      type = "video";
      content = items.map(
        (item) =>
          `[![](${HOST}/static/images/${item.replace(
            ".mp4",
            "-cover.webp"
          )})](${HOST}/static/videos/${item})`
      );
    } else if (/\.md$/.test(items[0])) {
      type = "markdown";
      const postFile = path.join(__dirname, "../resolvers/data", items[0]);
      content = [fs.readFileSync(postFile, "utf8")];
    } else if (/\.(png|jpeg|webp)$/.test(items[0])) {
      type = "image";
      content = items.map((item) => `![](${HOST}/static/images/${item})`);
    }

    content = content.reverse();

    let post = {
      type,
      category: `${root}/${d.name}`,
      title: "title-" + i,
      order: (i + 1) * 10,
    };
    let filename = items[0].replace(/(-[0-9])?\.(md|webp|mp4)$/, ".md");
    content.push("---\n");
    for (let [key, value] of Object.entries(post)) {
      content.push(`${key}: ${value}`);
    }
    content.push("---");
    // console.log({ filename }, "\n", content.reverse().join("\n"));
    fs.writeFileSync(
      path.join(OUT_DIR, filename),
      content.reverse().join("\n")
    );
  });
  delete d.feed;
  d = {
    type: "category",
    category: `${root}/${d.name}`,
    ...d,
    order: (categryIndex + 1) * 10,
  };
  let content = [];
  content.push("---");
  for (let [key, value] of Object.entries(d)) {
    content.push(`${key}: ${value}`);
  }
  content.push("---");
  fs.writeFileSync(
    path.join(OUT_DIR, `category-${d.name}.md`),
    content.join("\n")
  );
}
