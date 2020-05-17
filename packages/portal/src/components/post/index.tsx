import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as Types from "types";

type Props = { post: Types.IPost };
function Post({ post }: Props) {
  let source = "";
  if (post.images.length > 0) {
    source = post.images[0].url;
  }
  if (post.videos.length > 0) {
    source = post.videos[0].cover;
  }

  return (
    <Link to={`/post/${post.id}`}>
      <div>
        <Image src={"http://localhost:8000" + source} />
      </div>
    </Link>
  );
}

const Image = styled.img`
  width: 300px;
  height: 300px;
  padding: 20px 0;
`;

export default Post;
