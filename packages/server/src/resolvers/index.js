import fs from "fs";
import path from "path";
import depricatedResolvers from "./depricated-resolver";
import * as data from "./data";

const dataResolver = (data) => {
  return data.map((categoryData, i) => {
    return {
      ...categoryData,
      id: categoryData.name + i,
      icon: categoryData.name,
      feed: {
        pageInfo: {
          hasNextPage: false,
        },
        edges: categoryData.feed.map((post, i) => {
          let videos = [];
          let images = [];
          let markdown = null;

          const items = Array.isArray(post) ? post : [post];
          if (/mp4/.test(items[0])) {
            videos = items.map((item, j) => ({
              id: categoryData.name + i + j,
              url: `/static/videos/${item}`,
              cover: `/static/images/${item.replace(".mp4", "-cover.webp")}`,
            }));
          } else if (/\.md$/.test(items[0])) {
            const postFile = path.join(__dirname, "./data", items[0]);
            markdown = {
              // TODO: add cache
              content: fs.readFileSync(postFile, "utf8"),
              cover: `/static/images/${items[0].replace(".md", "-cover.webp")}`,
            };
          } else {
            images = items.map((item, j) => ({
              id: categoryData.name + i + j,
              url: `/static/images/${item}`,
            }));
          }

          return {
            node: {
              id: `id-${categoryData.name}-${i + 1}`,
              category: categoryData.name,
              title: "a-title",
              description: "the-description",
              images,
              videos,
              markdown,
            },
          };
        }),
      },
    };
  });
};

const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.1",
      };
    },
    postById: (obj, { id }) => {
      return [...dataResolver(data.parentData), ...dataResolver(data.childData)]
        .map((d) => d.feed.edges)
        .flat()
        .find((d) => {
          return d.node.id === id;
        }).node;
    },
    parentCategories: () => {
      return dataResolver(data.parentData);
    },
    childCategories: () => {
      return dataResolver(data.childData);
    },
    ...depricatedResolvers,
  },
};

export default resolvers;
