import React, { useState } from "react";
import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Share() {
  const currentUser = useSelector((state) => state.social.currentUser);
  const [post, setPost] = useState("");

  async function handlePostSubmit() {
    const newPost = {
      post_sender: currentUser.user_id,
      post_content: post,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/sendpost",
        newPost
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImage"
            src={"/assets/person/1.jpeg"}
            alt=""
          />
          <div className="shareInputCont"></div>
          <input
            onChange={(e) => {
              setPost(e.target.value);
            }}
            placeholder={"What's on your mind?"}
            className="shareInput"
          />
        </div>
        <hr className="shareHr" />
        <div className="shareButtom">
          <div className="shareOptions">
            <div className="shareOption">
              <VideoCameraBackIcon htmlColor="red" className="shareIcon" />
              <span className="shareOptionLongText">Live video</span>
              <span className="shareOptionText">Live</span>
            </div>
            <div className="shareOption">
              <PermMediaIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionLongText">Photo/video</span>
              <span className="shareOptionText">Gallery</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="orange" className="shareIcon" />
              <span className="shareOptionLongText">Feeling/Activity</span>
              <span className="shareOptionText">Feel</span>
            </div>
            <button onClick={handlePostSubmit} className="post__share">
              share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
