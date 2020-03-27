type Image = {
  url: string;
};

export type IPost = {
  id: string;
  title: string;
  category: string;
  images: Image[];
};
