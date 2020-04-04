export const childData = [
  {
    name: "kid",
    title: "کودک",
    feed: [
      Array.from({ length: 7 }).map((_, i) => `stress-kid-${i + 1}.webp`),
      Array.from({ length: 9 }).map((_, i) => `kid-awareness-${i + 1}.webp`),
      "deep-breathing.mp4",
      "baloon-breathing.webp",
    ],
  },
  {
    name: "teen",
    title: "نوجوان",
    feed: [
      ...Array.from({ length: 5 }).map((_, i) => `emotion-teen-${i + 1}.webp`),
      "relaxing-box.webp",
      Array.from({ length: 7 }).map((_, i) => `teen-sleep-${i + 1}.webp`),
    ],
  },
];

export const parentData = [
  {
    name: "stress",
    title: "مدیریت استرس",
    feed: [
      "stress.mp4",
      "crisis.mp4",
      "stress1.mp4",
      "stress2.mp4",
      "stress3.mp4",
      "anxiety.webp",
      Array.from({ length: 6 }).map((_, i) => `stress-t-${i + 1}.webp`),
      "thinking.mp4",
    ],
  },
  {
    name: "empathy",
    title: "همدلی با کودکان",
    feed: [
      "empathy.mp4",
      Array.from({ length: 6 }).map((_, i) => `empathy-tt-${i + 1}.webp`),
      Array.from({ length: 3 }).map((_, i) => `creative-${i + 1}.webp`),
    ],
  },
  {
    name: "grief",
    title: "کودکان سوگوار",
    feed: [
      "grief.mp4",
      "grief.webp",
      Array.from({ length: 14 }).map((_, i) => `grief-a-${i + 1}.webp`),
      Array.from({ length: 14 }).map((_, i) => `grief-t-${i + 1}.webp`),
    ],
  },
  {
    name: "depression",
    title: "افسردگی کودکان",
    feed: ["depression.mp4", "depression.webp"],
  },
  {
    name: "obsession",
    title: "وسواس کودکان",
    feed: ["obsession.mp4", "obsession.webp"],
  },
  {
    name: "adhd",
    title: "بیش‌فعالی و نقص توجه",
    feed: ["adhd.mp4", "adhd.webp"],
  },
  {
    name: "autism",
    title: "اختلال طیف اوتیسم",
    feed: [Array.from({ length: 4 }).map((_, i) => `autism${i + 1}.webp`)],
  },
  {
    name: "bipolar",
    title: "اختلال دوقطبی",
    feed: [
      "bipolar.mp4",
      "bipolar.webp",
      Array.from({ length: 8 }).map((_, i) => `bipolar-${i + 1}.webp`),
    ],
  },
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
    feed: [
      Array.from({ length: 6 }).map((_, i) => `education${i + 1}.webp`),
      Array.from({ length: 6 }).map((_, i) => `education${i + 7}.webp`),
    ],
  },
  {
    name: "parenting",
    title: "فرزندپروری",
    feed: [
      "parenting1.mp4",
      "parenting2.mp4",
      "parenting3.mp4",
      "parenting4.mp4",
    ],
  },
];
