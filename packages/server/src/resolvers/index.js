const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.1",
      };
    },
    parentFeed: () => {
      return {
        edges: Array.from({ length: 8 }, (_, i) => i).map((i) => ({
          node: {
            id: `id-${i + 1}`,
            imageUrl: `/static/images/note${(i % 3) + 1}.jpeg`,
            title: `note ${i + 1} title`,
          },
        })),
        pageInfo: {
          hasNextPage: false,
        },
      };
    },
  },
};

export default resolvers;
