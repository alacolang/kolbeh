export const childData = [
  {
    name: "kid",
    title: "اتاق کودک",
    description: `به اتاق کودک کلبه خوش آمدی. مطالب این اتاق به تو کمک می‌کنه که احساساتت رو بهتر بشناسی و حالت خوب باشه.`,
    feed: [
      Array.from({ length: 7 }).map((_, i) => `stress-kid-${i + 1}.webp`),
      Array.from({ length: 9 }).map((_, i) => `kid-awareness-${i + 1}.webp`),
      "deep-breathing.mp4",
      "baloon-breathing.webp",
    ],
  },
  {
    name: "teen",
    title: "اتاق نوجوان",
    description: `به اتاق نوجوان کلبه خوش‌ آمدید. مطالب این اتاق کمک می‌کنه که با احساساتتون بیشتر آشنا بشید و برای دغدغه‌ها و نگرانی‌هایی که دارید پاسخ‌هایی بگیرید که یک مشاور پیشنهاد می‌کنه.`,
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
    title: "مدیریت هیجان",
    description: ` کودکان و نوجوانان نیز مانند بزرگسالان انواع هیجان‌های خوشایند و ناخوشایند را تجربه می‌کنند، مطالب این بخش به مدیریت هیجان‌های نا‌خوشایند فرزندتان ارتباط دارد.`,
    feed: [
      "crisis.mp4",
      "adolescent-coping-1.mp4",
      "adolescent-coping-2.mp4",
      "stress1.mp4",
      "stress3.mp4",
      "thinking.mp4",
    ],
  },
  {
    name: "empathy",
    title: `همدلی و ارتباط`,
    description: ` اگر تمایل دارید با فرزندتان به صورت همدلانه‌تری گفتگو کنید و شنونده بهتری باشید، ‌مطالب این بخش می‌تواند برایتان مفید باشد.`,
    feed: [
      "empathy.mp4",
      Array.from({ length: 6 }).map((_, i) => `empathy-tt-${i + 1}.webp`),
      Array.from({ length: 6 }).map(
        (_, i) => `empathy-corona-poem-${i + 1}.webp`
      ),
      `creative-1.mp4`,
      `creative-2.mp4`,
      `creative-3.mp4`,
    ],
  },
  {
    name: "axiety",
    title: `ترس و اضطراب`,
    description: ` در این بخش راهکارهای مفیدی برای کاهش شدت هیجان نگرانی و افکار اضطرابی در کودکان و نوجوانان معرفی می‌شود.`,
    feed: [
      "stress.mp4",
      "stress2.mp4",
      "anxiety.webp",
      Array.from({ length: 6 }).map((_, i) => `stress-t-${i + 1}.webp`),
    ],
  },
  {
    name: "grief",
    title: "سوگواری",
    description: ` کودکان و نوجوانان به دلایلی مثل از دست دادن عزیزان،‌ بیماری یا جدایی والدین، ... ممکن است سوگوار شوند. در این بخش با ویژگی‌های سوگ در کودکان و نوجوانان و شیوه همراهی با آنان آشنا می‌شوید.`,
    feed: [
      "grief.mp4",
      "grief.webp",
      Array.from({ length: 14 }).map((_, i) => `grief-a-${i + 1}.webp`),
      Array.from({ length: 14 }).map((_, i) => `grief-t-${i + 1}.webp`),
    ],
  },
  {
    name: "depression",
    title: "افسردگی",
    description: ` خلق افسرده نه تنها باعث رنج فرزندان می‌شود، بلکه بر روحیه سایر اعضای خانواده‌ نیز تاثیر می‌گذارد. مطالب این بخش به بهبود خلق فرزندتان و بالا رفتن روحیه خانواده کمک می‌کند.`,
    feed: ["depression.mp4", "depression.webp"],
  },
  {
    name: "obsession",
    title: "وسواس و اجبار",
    description: ` وسواس در کودکان و نوجوانان، ‌در کنار مداخلات درمانی، به همراهی والدین نیازمند است. این بخش به شما کمک می‌کند والدین همراه‌تری باشید.`,
    feed: ["obsession.mp4", "obsession.webp"],
  },
  {
    name: "autism",
    title: "اختلال طیف اوتیسم",
    description: ` اختلالات طیف اوتیسم پرسش‌های بسیاری در ذهن والدین ایجاد می‌کند. اطلاعات این اتاق در پاسخ به این پرسش‌ها است.`,
    feed: [Array.from({ length: 4 }).map((_, i) => `autism${i + 1}.webp`)],
  },
  {
    name: "adhd",
    title: "بیش‌فعالی و کمبود تمرکز",
    description: ` داشتن فرزند مبتلا به بیش‌فعالی و نقص توجه، ممکن است سوالات زیادی را در ذهن شما ایجاد کند. این بخش پاسخ‌گوی سوالات شما است.`,
    feed: ["adhd.mp4", "adhd.webp"],
  },
  {
    name: "bipolar",
    title: "اختلال دوقطبی",
    description: ` اختلال دوقطبی و مشکلات ناشی از بالا وپائین‌ شدن خلق برای والدین و فرزندانشان بسیار چالش برانگیز است. مطالب این بخش می‌تواند در سفر بهبودی فرزندتان همراهتان باشد.`,
    feed: [
      "bipolar.mp4",
      "bipolar.webp",
      Array.from({ length: 8 }).map((_, i) => `bipolar-${i + 1}.webp`),
    ],
  },
  {
    name: "parenting",
    title: "فرزندپروری",
    description: ` در کنار مهارت‌های خوبی که والدین در تربیت فرزندشان اعمال می‌کنند، ‌گاهی دچارخطاهایی می‌شوند که با افزایش آگاهی و مهارت قابل اصلاح هستند. برای این که فرزندان همراه‌ و درعین حال مستقلی داشته باشید، مطالب این بخش را مطالعه کنید.`,
    feed: [
      "parenting1.mp4",
      "parenting2.mp4",
      "parenting3.mp4",
      "parenting4.mp4",
    ],
  },
  {
    name: "education",
    title: "فعالیت‌های تحصیلی",
    description: ` روش و محتوای آموزش های آکادمیک درعصر فن¬آوری، به سرعت در حال تغییر است و آگاهی از شیوه صحیح کنارآمدن با این تغییرات، فضا را برای یادگیری بهترآماده می‌کند. در این بخش با شیوه‌ی سازگاری با این تغییرات آشنا می‌شوید.`,
    feed: [
      Array.from({ length: 6 }).map((_, i) => `education${i + 1}.webp`),
      Array.from({ length: 6 }).map((_, i) => `education${i + 7}.webp`),
    ],
  },
];
