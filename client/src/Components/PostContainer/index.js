import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "../redux/reducers/postReducer";
import { format } from "timeago.js";
import "./style.css";

const PostContainer = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);
  const userId = localStorage.getItem("userId");

  const [isHovover, setIsHovered] = useState(false);
  const [isHovoverLike, setIsHoveredLike] = useState(false);

  const [postId, setPostId] = useState(null);

  const handleMouseOver = (postId) => {
    setIsHovered(true);
    setPostId(postId);
  };

  const handleMouseOverLike = (postId) => {
    setIsHoveredLike(true);
    setPostId(postId);
  };

  const handleMouseOutLike = (postId) => {
    setIsHoveredLike(false);
    setPostId(postId);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  const getPosts = async () => {
    try {
      const posts = await axios.get(`${process.env.REACT_APP_API}/api/post`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (posts) {
        const reversePost = posts.data.posts.reverse();
        dispatch(setPost(reversePost));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addLike = (postId) => {
    try {
      const like = {
        postId,
        userId,
      };
      const response = axios.post(
        `${process.env.REACT_APP_API}/api/like`,
        like,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="psotContatiner">
            <div className="postPhoto">
              <img alt="ProfileImage" src={post.user.avatar} />
            </div>
            <div className="post">
              <span className="postName">
                {post.user.firstname} {post.user.lastname}
              </span>
              <span className="username">@{post.user.username}.</span>
              <span className="postDate"> {format(post.createdAt)}</span>
              <p className="postCaption">{post.caption}</p>
              <div>
                <div
                  onMouseOver={() => handleMouseOver(post._id)}
                  onMouseOut={handleMouseOut}
                  className={
                    post._id === postId && isHovover
                      ? " commentSVG commentSVGBefor commentSVGHover"
                      : "commentSVG"
                  }
                >
                  <svg viewBox="0 0 24 24">
                    <g>
                      <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                    </g>
                  </svg>
                </div>
                <span
                  className={
                    post._id === postId && isHovover
                      ? "numberOfCommentHover numberOfComment "
                      : "numberOfComment"
                  }
                >
                  {post.comments.length}
                </span>
              </div>
              <div>
                <div
                  onMouseOver={() => handleMouseOverLike(post._id)}
                  onMouseOut={handleMouseOutLike}
                  onClick={() => addLike(post._id)}
                  className={
                    post._id === postId && isHovoverLike
                      ? "LikePostSVG LikePostSVGBefor LikePostSVGHover"
                      : "LikePostSVG"
                  }
                >
                  <svg viewBox="0 0 24 24">
                    <g>
                      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                    </g>
                  </svg>
                </div>
                <span
                  className={
                    post._id === postId && isHovoverLike
                      ? "numberOfLike numberOfLikeHover"
                      : "numberOfLike"
                  }
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PostContainer;