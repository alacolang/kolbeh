const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.1",
      };
    },
    parentFeed: () => {
      return {
        edges: [
          { id: "1", image: "/static/images/note1.jpeg", title: "note 1 title" },
          { id: "2", image: "/static/images/note2.jpeg", title: "note 2 title" },
          { id: "3", image: "/static/images/note3.jpeg", title: "note 3 title" },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      };
    },
  },
};

export default resolvers;
