import React from "react";
import * as Types from "types";
import { resolveURL } from "utils/resolve";
import ProgressiveImage from "components/progressive-image";

type IProps = {
  post: Types.IPost;
};

const TheImage = ({ post }: IProps) => {
  if (!(post && post.images && post.images[0])) {
    return null;
  }
  const uri = resolveURL(post.images[0].url);

  return <ProgressiveImage uri={uri} />;
};

export default TheImage;
