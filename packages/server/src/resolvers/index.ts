import { IResolvers } from "apollo-server-express";
import parse, { Category, sortByDateThenOrder, Parsed } from "../content/parse";
import happinessTrainingData from "./data/happinessTraining";

let parsedData: Parsed;

export type PostType = "image" | "video" | "markdown" | "inapp";

const ALL_TYPES = ["image", "video", "markdown", "inapp"] as const;
const OLD_TYPES = ["image", "video", "markdown"] as const;

async function init() {
  parsedData = await parse();
}

init();

function fixIconTypo(name: string) {
  if (name === "anxiety") return "axiety";
  return name;
}

const dataResolver = (
  data: Category[],
  types: Readonly<PostType[]> = OLD_TYPES
) => {
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

const resolvers: IResolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.3",
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
        .sort((a, b) => sortByDateThenOrder(a.node, b.node));

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
    categoryById: (_, { id, types = ALL_TYPES }) => {
      console.log({ id });
      return dataResolver(parsedData.child, types).find((d) => d.id === id);
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
    happinessTraining: () => happinessTrainingData,
  },
};

export default resolvers;
