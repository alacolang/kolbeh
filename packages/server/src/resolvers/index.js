const parentPosts = [
  {
    name: "stress",
    title: "مدیریت استرس",
  },
  {
    name: "empathy",
    title: "همدلی و گفتگو با کودکان در بحران‌ها",
    images: ["empathy01.jpeg", "empathy02.jpeg", "empathy03.jpeg"],
  },
  {
    name: "grief",
    title: "کودکان سوگوار",
  },
  {
    name: "depression",
    title: "افسردگی کودکان",
  },
  {
    name: "obsession",
    title: "وسواس کودکان",
  },
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
  },
  {
    name: "adhd",
    title: "بیش‌فعالی و نقص توجه",
  },
  {
    name: "autism",
    title: "اختلال طیف اوتیسم",
  },
  {
    name: "bipolar",
    title: "اختلال دوقطبی",
  },
  {
    name: "parenting",
    title: "خطاهای فرزندپروری در بحران‌ها",
  },
];

const getImages = (i) => {
  if (!parentPosts[i].images) {
    return [
      {
        url: `/static/images/${parentPosts[i].name}.jpeg`,
      },
    ];
  } else {
    return parentPosts[i].images.map((image) => ({
      url: `/static/images/${image}`,
    }));
  }
};

const fakeEdges = () =>
  Array.from({ length: 10 }, (_, i) => i).map((i) => ({
    node: {
      id: `id-${i + 1}`,
      images: getImages(i),
      category: parentPosts[i].name,
      title: parentPosts[i].title,
    },
  }));

// const edges = [{ id: 1, title: "", imageUrl: "/static/images/" }];

const resolvers = {
  Query: {
    info: () => {
      return {
        version: "0.0.1",
      };
    },
    parentFeed: () => {
      return {
        edges: fakeEdges(),
        pageInfo: {
          hasNextPage: false,
        },
      };
    },
  },
};

export default resolvers;
