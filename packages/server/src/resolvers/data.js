export const childData = [
  {
    name: "kid",
    title: "کودک آرام",
    feed: [
      Array.from({ length: 7 }).map((_, i) => `stress-kid-${i + 1}.png`),
      Array.from({ length: 9 }).map((_, i) => `kid-awareness-${i + 1}.png`),
      "deep-breathing.mp4",
      "baloon-breathing.png",
    ],
  },
  {
    name: "teen",
    title: "نوجوان آرام",
    feed: [
      ...Array.from({ length: 5 }).map((_, i) => `emotion-teen-${i + 1}.png`),
      "relaxing-box.png",
      Array.from({ length: 7 }).map((_, i) => `teen-sleep-${i + 1}.png`),
    ],
  },
];

export const parentData = [
  {
    name: "stress",
    title: "مدیریت استرس",
    feed: [
      "stress.mp4",
      "stress1.mp4",
      "stress2.mp4",
      "stress3.mp4",
      "anxiety.png",
      Array.from({ length: 6 }).map((_, i) => `stress-t-${i + 1}.png`),
    ],
  },
  {
    name: "empathy",
    title: "همدلی با کودکان",
    feed: [
      "empathy.mp4",
      Array.from({ length: 6 }).map((_, i) => `empathy-tt-${i + 1}.png`),
    ],
  },
  {
    name: "grief",
    title: "کودکان سوگوار",
    feed: [
      "grief.mp4",
      "grief.jpeg",
      Array.from({ length: 14 }).map((_, i) => `grief-a-${i + 1}.png`),
      Array.from({ length: 14 }).map((_, i) => `grief-t-${i + 1}.png`),
    ],
  },
  {
    name: "depression",
    title: "افسردگی کودکان",
    feed: ["depression.mp4", "depression.jpeg"],
  },
  {
    name: "obsession",
    title: "وسواس کودکان",
    feed: ["obsession.mp4", "obsession.jpeg"],
  },
  {
    name: "adhd",
    title: "بیش‌فعالی و نقص توجه",
    feed: ["adhd.mp4", "adhd.jpeg"],
  },
  {
    name: "autism",
    title: "اختلال طیف اوتیسم",
    feed: [Array.from({ length: 4 }).map((_, i) => `autism${i + 1}.png`)],
  },
  {
    name: "bipolar",
    title: "اختلال دوقطبی",
    feed: [
      "bipolar.mp4",
      "bipolar.jpeg",
      Array.from({ length: 8 }).map((_, i) => `bipolar-${i + 1}.png`),
    ],
  },
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
    feed: [
      Array.from({ length: 6 }).map((_, i) => `education${i + 1}.png`),
      Array.from({ length: 6 }).map((_, i) => `education${i + 7}.png`),
    ],
  },
  {
    name: "parenting",
    title: "خطاهای فرزندپروری",
    feed: [
      "parenting1.mp4",
      "parenting2.mp4",
      "parenting3.mp4",
      "parenting4.mp4",
    ],
  },
];
