import depricatedResolvers from "./depricated-resolver";
import parse from "../content/parse";
let parsedData;

async function init() {
  parsedData = await parse();
}

init();

const dataResolver = data => {
  return data.map(d => {
    return {
      ...d,
      icon: d.name,
      feed: {
        edges: d.feed.map(post => ({ node: post })),
        pageInfo: {
          hasNextPage: false,
        },
      },
    };
  });
};

const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.2",
      };
    },
    postById: (obj, { id }) => {
      return [
        ...dataResolver(parsedData.parent),
        ...dataResolver(parsedData.child),
      ]
        .map(d => d.feed.edges.map(post => ({ node: post })))
        .flat()
        .find(d => {
          return d.node.id === id;
        }).node;
    },
    posts: () => {
      const edges = [
        ...dataResolver(parsedData.parent),
        ...dataResolver(parsedData.child),
      ]
        .map(d => d.feed.edges)
        .flat();

      return {
        edges,
        pageInfo: {
          hasNextPage: false,
        },
      };
    },
    parentCategories: () => {
      return dataResolver(parsedData.parent);
    },
    childCategories: () => {
      return dataResolver(parsedData.child);
    },
    ...depricatedResolvers,
  },
};

export default resolvers;
