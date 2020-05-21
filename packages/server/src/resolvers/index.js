import depricatedResolvers from "./depricated-resolver";
import parse from "../content/parse";
let parsedData;

const ALL_TYPES = ["image", "video", "markdown", "inapp"];
const OLD_TYPES = ["image", "video", "markdown"];

async function init() {
  parsedData = await parse();
}

init();

function fixIconTypo(name) {
  if (name === "anxiety") return "axiety";
  return name;
}

const sortByDateThenOrder = (p1, p2) => {
  try {
    if (p2.node.date && p1.node.date) {
      return (
        new Date(p2.node.date).getTime() - new Date(p1.node.date).getTime()
      );
    } else if (p2.node.date && !p1.node.date) {
      return 1;
    } else if (p1.node.date && !p2.node.date) {
      return -1;
    } else {
      return p1.node.order - p2.node.order;
    }
  } catch (e) {
    return p1.node.order - p2.node.order;
  }
};

const dataResolver = (data, types = OLD_TYPES) => {
  return data.map((d) => {
    return {
      ...d,
      icon: fixIconTypo(d.name),
      feed: {
        edges: d.feed
          .filter((p) => {
            return types.includes(p.type);
          })
          .map((post) => ({ node: post })),
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
    postById: (_, { id }) => {
      return [
        ...dataResolver(parsedData.parent, ALL_TYPES),
        ...dataResolver(parsedData.child, ALL_TYPES),
      ]
        .map((d) => d.feed.edges.map((post) => post.node))
        .flat()
        .find((d) => {
          return d.id === id;
        });
    },
    posts: (_, { types }) => {
      const edges = [
        ...dataResolver(parsedData.parent, types),
        ...dataResolver(parsedData.child, types),
      ]
        .map((d) => d.feed.edges)
        .flat()
        .sort(sortByDateThenOrder);

      return {
        edges,
        pageInfo: {
          hasNextPage: false,
        },
      };
    },
    parentCategories: (_, { types }) => {
      return dataResolver(parsedData.parent, types);
    },
    childCategories: (_, { types }) => {
      return dataResolver(parsedData.child, types);
    },
    promotions: (_, { types }) => {
      return [
        ...dataResolver(parsedData.parent, types),
        ...dataResolver(parsedData.child, types),
      ]
        .map((d) => d.feed.edges)
        .flat()
        .filter(({ node }) => !!node.description)
        .map(({ node: { id, description } }) => ({ id, description }));
    },
    ...depricatedResolvers,
  },
};

export default resolvers;
