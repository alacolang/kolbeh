type Image = {
  url: string;
};

type Video = {
  url: string;
  cover: string;
};

export type IPost = {
  id: string;
  title: string;
  category: string;
  images: Image[];
  videos: Video[];
};
