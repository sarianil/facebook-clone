import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Post() {
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const likeHandler = async (like) => {
    const newPostStatus = {
      likeSender: currentUser.user_id,
      post_id: like,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/likeupdate",
        newPostStatus
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const flowData = useSelector((state) => state.flowdata.flowData);
  const currentUser = useSelector((state) => state.social.currentUser);

  const handleCommentSubmit = async (e) => {
    const postId = parseInt(e.target.id);
    const newComment = {
      comment_sender: currentUser.user_id,
      comment_content: commentContent,
      commentPost_id: postId,
    };
    console.log(newComment);
    try {
      const response = await axios.post(
        "http://localhost:5000/sendcomment",
        newComment
      );
      console.log(response.data); // Handle response
      // Optionally, refresh comments or clear the input field
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="post">
      {flowData.map((item) => (
        <div key={item.post_id} className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <img
                className="postProfileImage"
                src="https://picsum.photos/200/300"
                alt=""
              />
              <span className="postUsername">{item.post_sender_name}</span>
            </div>
            <div className="postTopRight">
              <span className="postDate">{item.post_date}</span>
              <MoreVertIcon style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div className="postCenter">
            <span className="postText">{item.post_content}</span>
            <img
              className="postImage"
              src="https://picsum.photos/200/300"
              alt=""
            />
          </div>
          <div className="post__send__comment">
            <input
              onChange={(e) => {
                setCommentContent(e.target.value);
              }}
              className="post__send__comment__input"
              type="text"
            />
            <button
              id={item.post_id}
              onClick={handleCommentSubmit}
              className="post__send__comment__btn"
            >
              SEND
            </button>
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <div style={{ display: "flex" }}>
                <div className="likeIconCont">
                  <img
                    id={item.post_id}
                    className="likeIcon"
                    onClick={(e) => {
                      const like = e.target.id;
                      likeHandler(like);
                    }}
                    src={"../assets/like.png"}
                    alt=""
                  />
                </div>
              </div>
              <span className="postLikeCounter">
                {item ? item.post_likes.length : ""} people like it
              </span>
            </div>
            <div className="postBottomRight">
              <span className="postCommentText">
                {item.comments && item.comments[0].comment_id != null
                  ? item.comments.length
                  : 0}{" "}
                comments
              </span>
            </div>
          </div>

          {item.comments &&
            item.comments.map((comment) =>
              item.comments[0].comment_id != null ? (
                <div className="post__comments">
                  <div className="post__comments__box" key={comment.comment_id}>
                    <p>{comment.comment_sender_name}</p>
                    <p>{comment.comment_content}</p>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
        </div>
      ))}
    </div>
  );
}
