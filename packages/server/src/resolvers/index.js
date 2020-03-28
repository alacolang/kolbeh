const parentPosts = [
  {
    name: "stress",
    title: "مدیریت استرس",
    videos: [
      { filename: "stress.mp4" },
      { filename: "stress1.mp4" },
      { filename: "stress2.mp4" },
      { filename: "stress3.mp4" },
    ],
    images: Array.from({ length: 6 }).map((_, i) => ({
      filename: `stress-t-${i + 1}.png`,
    })),
  },
  {
    name: "empathy",
    title: "همدلی و گفتگو با کودکان در بحران‌ها",
    videos: [{ filename: "empathy.mp4" }],
    images: Array.from({ length: 6 }).map((_, i) => ({
      filename: `empathy-tt-${i + 1}.png`,
    })),
  },
  {
    name: "grief",
    title: "کودکان سوگوار",
    videos: [{ filename: "grief.mp4" }],
    images: [
      { filename: "grief.jpeg" },
      ...Array.from({ length: 5 }).map((_, i) => ({
        filename: `grief-t-${i + 1}.png`,
      })),
    ],
  },
  {
    name: "depression",
    title: "افسردگی کودکان",
    videos: [{ filename: "depression.mp4" }],
  },
  {
    name: "obsession",
    title: "وسواس کودکان",
    videos: [{ filename: "obsession.mp4" }],
  },
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
    images: Array.from({ length: 12 }).map((_, i) => ({
      filename: `education${i + 1}.png`,
    })),
  },
  {
    name: "adhd",
    title: "بیش‌فعالی و نقص توجه",
    videos: [{ filename: "adhd.mp4" }],
  },
  {
    name: "autism",
    title: "اختلال طیف اوتیسم",
    images: Array.from({ length: 4 }).map((_, i) => ({
      filename: `autism${i + 1}.png`,
    })),
  },
  {
    name: "bipolar",
    title: "اختلال دوقطبی",
    videos: [{ filename: "bipolar.mp4" }],
  },
  {
    name: "parenting",
    title: "خطاهای فرزندپروری در بحران‌ها",
    videos: [
      { filename: "parenting1.mp4" },
      { filename: "parenting2.mp4" },
      { filename: "parenting3.mp4" },
      { filename: "parenting4.mp4" },
    ],
  },
];

const getVideos = (i) => {
  const meta = parentPosts[i].videos || [];
  return meta.map((meta) => ({
    url: `/static/videos/${meta.filename}`,
    cover: `/static/images/${meta.filename.replace(".mp4", "-cover.png")}`,
  }));
};

const getImages = (i) => {
  if (!parentPosts[i].images) {
    return [
      {
        url: `/static/images/${parentPosts[i].name}.jpeg`,
      },
    ];
  } else {
    return parentPosts[i].images.map((image) => ({
      url: `/static/images/${image.filename}`,
    }));
  }
};

const fakeEdges = () =>
  Array.from({ length: 10 }, (_, i) => i).map((i) => ({
    node: {
      id: `id-${i + 1}`,
      images: getImages(i),
      videos: getVideos(i),
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
