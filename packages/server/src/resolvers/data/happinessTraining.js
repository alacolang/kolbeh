const categories = [
  "optimism",
  "forgiveness",
  "connection",
  "empathy",
  "kindness",
  "gratitude",
  "awe",
  "resilience",
  "self-compassion",
].map((key) => ({
  id: `${key}`,
  title: `${key}`,
  exercises: [
    {
      id: `${key}-1`,
      order: 1,
      title: `${key}-title-1`,
    },
    {
      id: `${key}-2`,
      order: 2,
      title: `${key}-title-2`,
    },
  ],
}));

export default {
  categories,
};
