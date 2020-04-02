import depricatedResolvers from "./depricated-resolver";
import * as data from './data'

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

          const items = Array.isArray(post) ? post : [post];
          if (/mp4/.test(items[0])) {
            videos = items.map((item, j) => ({
              id: categoryData.name + i + j,
              url: `/static/vidoes/${item}`,
              cover: `/static/images/${item.replace(".mp4", "-cover.png")}`,
            }));
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
