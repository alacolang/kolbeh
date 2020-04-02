export const childData = [
  {
    name: "kid",
    title: "کودک آرام",
    feed: [Array.from({ length: 7 }).map((_, i) => `stress-kid-${i + 1}.png`)],
  },
  {
    name: "teen",
    title: "نوجوان آرام",
    feed: Array.from({ length: 5 }).map((_, i) => `emotion-teen-${i + 1}.png`),
  },
];

export const parentData = [
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
    feed: [
      Array.from({ length: 6 }).map((_, i) => `education${i + 1}.png`),
      Array.from({ length: 6 }).map((_, i) => `education${i + 7}.png`),
    ],
  },
  {
    name: "stress",
    title: "مدیریت استرس",
    feed: [
      [Array.from({ length: 6 }).map((_, i) => `stress-t-${i + 1}.png`)],
      "stress.mp4",
      "stress1.mp4",
      "stress2.mp4",
      "stress3.mp4",
    ],
  },
  {
    name: "empathy",
    title: "همدلی و گفتگو با کودکان در بحران‌ها",
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
      Array.from({ length: 5 }).map((_, i) => `grief-t-${i + 1}.png`),
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
    feed: ["bipolar.mp4", "bipolar.jpeg"],
  },
  {
    name: "parenting",
    title: "خطاهای فرزندپروری در بحران‌ها",
    feed: [
      "parenting1.mp4",
      "parenting2.mp4",
      "parenting3.mp4",
      "parenting4.mp4",
    ],
  },
];

