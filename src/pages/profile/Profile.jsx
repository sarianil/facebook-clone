import "./profile.css";
import Feed from "../../components/feed/Feed";
import Topbar from "../../components/topbar/Topbar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Users } from "../../dummyData";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser } from "../../redux/thunk";
import axios from "axios";

function Profile() {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const currentUser = useSelector((state) => state.social.currentUser);
  const status = useSelector((state) => state.social.status);
  const error = useSelector((state) => state.social.error);

  const [bio, setBio] = useState("");
  async function handleUpdateBio() {
    try {
      const response = await axios.post(
        "http://localhost:5000/update-bio",
        {
          user_id: currentUser.user_id,
          bio: bio,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data); // Sunucudan dönen yanıtı işleme
      // Başarı mesajı veya hata durumunu işleyebilirsiniz
      window.location.reload();
    } catch (error) {
      console.error("Biyografi güncellenirken hata oluştu:", error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {}, [currentUser]);
  const [ısActive, setIsActive] = useState(false);
  function editBio() {
    if (ısActive == false) {
      setIsActive(true);
    }
    console.log(bio);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    console.log("Seçilen dosya:", file.name);
  };

  return (
    <div className="profile">
      <Topbar />
      <div className="fbIcon">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            height="50px"
            src={process.env.PUBLIC_URL + "/assets/icon.png"}
            alt=""
          />
        </Link>
      </div>
      <div className="profileContainer">
        <div className="profileCenter">
          <div className="profileCenterTop">
            <img
              src={process.env.PUBLIC_URL + "/assets/coverpic.jpg"}
              alt="coverphoto"
              className="coverPhoto"
            />

            <input
              className="editCoverPhotoBtn"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="profileCenterDown">
            <div className="profileCenterDownCont">
              <div className="profilePhotoCont">
                <img
                  src={`/assets/person/${
                    currentUser ? currentUser.user_id : ""
                  }.jpeg`}
                  alt="profilephoto"
                  className="profilePhoto"
                />
              </div>
              <h4 className="profileUsername">
                {currentUser ? currentUser.user_name : ""}
                <p
                  style={{
                    fontSize: "16px",
                    margin: "0",
                    opacity: "0.5",
                  }}
                >
                  209 friends
                </p>
              </h4>
            </div>
          </div>
        </div>

        <div className="profileBottom">
          <div className="profileBottomLeft">
            <div className="profileUserInfo">
              <h4
                style={{
                  position: "absolute",
                  top: "50px",
                  marginLeft: "5px",
                }}
              >
                Intro
              </h4>

              <p>{currentUser ? currentUser.user_bio : ""}</p>
              <button
                id={currentUser ? currentUser.user_id : ""}
                onClick={editBio}
                type="button"
                className="editBioButton"
              >
                <b>Edit Bio</b>
              </button>
              {ısActive && (
                <div>
                  <input
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                    type="text"
                  />
                  <button
                    onClick={() => {
                      setIsActive(false);
                      handleUpdateBio();
                    }}
                  >
                    save
                  </button>
                </div>
              )}
            </div>
            <div className="profileMutualFriendCont">
              <h4
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "5px",
                  margin: "0",
                }}
              >
                Mutual Friends
              </h4>
              {Users.filter((user) => user.id > 1 && user.id <= 7).map(
                (user) => (
                  <div key={user.id} className="mutualFriend">
                    <img
                      className="profileMutualFriendImg"
                      src={user.profilePicture}
                      alt=""
                    />
                    <span className="profileMutualFriendName">
                      {user.username}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="profileBottomRight">
            <Feed className="profileFeed" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
