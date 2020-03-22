const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.1",
      };
    },
  },
};

export default resolvers;
