import { readFile } from "fs";
import util from "util";
import md5 from "md5";
import marked from "marked";
import { basename } from "path";
import glob from "glob";
import fm from "front-matter";
import R from "ramda";
import { PostType } from "../resolvers/index";
const x = __dirname + "/posts/**/*.md";

const matches = glob.sync(x);
const readFileAsync = util.promisify(readFile);

function normalizeHref(href: string) {
  const adjustPathRE = new RegExp("../../static/", "g");
  const adjustExtensionRE = /\.png$/g;
  return href
    .replace(adjustPathRE, "/static/")
    .replace(adjustExtensionRE, ".webp");
}

function createImageFeild(href: string) {
  return { url: normalizeHref(href), id: md5(href) };
}

function createVideoFeild(href: string, hrefCover: string) {
  return { url: normalizeHref(href), id: md5(href), cover: hrefCover };
}

// feed: [Array],
// type: 'category',
// category: 'child/teen',
// name: 'teen',
// title: 'اتاق نوجوان',
// description: 'به اتاق نوجوان کلبه خوش آمدید. مطالب این اتاق کمک میکنه که با احساساتتون بیشتر آشنا بشید و برای دغدغهها و نگرانیهایی که دارید پاسخهایی بگیرید که یک مشاور پیشنهاد میکنه.',
// order: 20,
// id:
export type Category = {
  feed: Post[];
  type: "category";
  category: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  order: number;
  id: string;
};
// title: 'مدیریت هیجان کودکان در دوران کرونا',
//   category: 'stress',
//   type: 'video',
//   date: '2020-06-23 18:00',
//   tags: [ 'مدیریت هیجان', 'فرزندپروری' ],
//   id: 'parent/stress:koosha-emotion.md',
//   images: [],
//   videos: [
//     {
//       url: '/static/videos/koosha-emotion.mp4',
//       id: 'baadc97a01f53b40563474832cdb4c7a',
//       cover: '/static/images/koosha-emotion-cover.webp'
//     }
//   ],
//   markdown: undefined

type Video = {
  url: string;
  id: string;
  cover: string;
};
type Image = {
  url: string;
  id: string;
};
type Markdown = {
  content: string;
  cover: string;
};

type Post = {
  id: string;
  title: string;
  description: string | undefined;
  category: string;
  type: PostType;
  date: string | undefined;
  tags: string[];
  order?: number | undefined;
  images: Image[];
  videos: Video[];
  markdown: Markdown | undefined;
};

export type Parsed = {
  parent: Category[];
  child: Category[];
};

type Attributes =
  | {
      title: string;
      category: string;
      type: "markdown";
      date?: string;
      tags: string[];
      cover: string;
      description?: string;
    }
  | {
      title: string;
      category: string;
      type: Exclude<PostType, "markdown">;
      date?: string;
      description?: string;
      tags: string[];
    }
  | {
      type: "category";
      category: string; // "parent/stress"
      name: string;
      title: string;
      shortDescription?: string;
      description: string;
      order?: number;
    };

function parse(): Promise<Parsed> {
  let result: Parsed = { parent: [], child: [] };
  return Promise.all(
    matches.map(async (match) => {
      const fileContent = await readFileAsync(match, "utf8");

      let images: Image[] = [];
      let videos: Video[] = [];
      let markdown;

      const parsedFileContent = fm(fileContent);

      function handleImageVideoPost() {
        const renderer = new marked.Renderer() as any;
        renderer.image = (href: string, title: string, text: string) => {
          images.push(createImageFeild(href));
        };

        renderer.link = (href: string, title: string, text: string) => {
          videos.push(createVideoFeild(href, images[0].url));
        };

        marked(parsedFileContent.body, { renderer });
      }

      const meta = parsedFileContent.attributes as Attributes;
      const { category } = meta;

      handleImageVideoPost();
      if (meta.type === "image" || meta.type == "video") {
        // empty
      } else if (meta.type === "markdown") {
        markdown = {
          content: normalizeHref(parsedFileContent.body),
          cover: (createImageFeild(meta.cover) || images[0]).url,
        };
        images = [createImageFeild(meta.cover) || images[0]];
        videos = [];
      }

      const keyPath = category.split("/");

      if (!R.hasPath(keyPath, result)) {
        result = R.assocPath(keyPath, { feed: [] }, result);
      }

      if (meta.type === "category") {
        result = R.assocPath(
          keyPath,
          { ...(R.path(keyPath, result) as any), ...meta, id: meta.category },
          result
        );
      } else {
        const post: Post = {
          id: `${category}:${basename(match)}`,
          title: meta.title,
          date: meta.date,
          type: meta.type,
          category: keyPath[1],
          tags: meta.tags,
          images: videos.length > 0 ? [] : images,
          videos: videos,
          markdown: markdown,
          description: meta.description,
        };
        const x = R.path(keyPath, result) as Category;
        x.feed.push(post);
      }
    })
  ).then(() => {
    result.parent = Object.values(result.parent).sort(sortByOrder);
    result.parent = result.parent.map((category) => {
      category.feed.sort(sortByDateThenOrder);
      return category;
    });
    result.child = Object.values(result.child).sort(sortByOrder);
    result.child = result.child.map((category) => {
      category.feed.sort(sortByDateThenOrder);
      return category;
    });
    // console.log("result=", JSON.stringify(result, null, 2));
    // writeFileSync("data.json", JSON.stringify(result, null, 2));
    return result;
  });
}

const sortByOrder = (a: Category, b: Category): number => a.order - b.order;

export const sortByDateThenOrder = (p1: Post, p2: Post): number => {
  try {
    if (p2.date && p1.date) {
      return new Date(p2.date).getTime() - new Date(p1.date).getTime();
    } else if (p2.date && !p1.date) {
      return 1;
    } else if (p1.date && !p2.date) {
      return -1;
    } else {
      return (p1.order ?? 0) - (p2.order ?? 0);
    }
  } catch (e) {
    return (p1.order ?? 0) - (p2.order ?? 0);
  }
};

parse();
// parse().then((d) => {
// console.log(d.parent[1].feed[0]);
// });

export default parse;
