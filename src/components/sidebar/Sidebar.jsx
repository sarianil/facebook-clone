import "./sidebar.css";
import { RssFeed, Chat, Group, HelpOutline, Event } from "@mui/icons-material";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();
  //to hide/show certain elements
  const [showHidden, setShowHidden] = useState(false);
  const logoutToggle = () => {
    setShowHidden(!showHidden);
  };

  //to ask user if they really want to logout
  const confirmLogout = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (userConfirmed) {
      logoutUser();
    }
  };

  const logoutUser = () => {
    axios
      .get("http://localhost:5000/oturumu-kapat")
      .then((response) => {
        console.log(response);
        // Eğer oturum başarıyla sonlandırıldıysa kullanıcıyı giriş sayfasına yönlendir
        if (response.status === 200) {
          navigate("/login"); // Kullanıcıyı login sayfasına yönlendirebilirsiniz
        }
      })
      .catch((error) => {
        console.error("Oturumu sonlandırma sırasında bir hata oluştu:", error);
      });
  };

  //for selecting mode and doing its function
  const [mode, setMode] = useState("day");
  const getSelectedMode = (e) => {
    setMode(e.target.value);
  };

  console.log(mode);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" style={{ color: "skyblue" }} />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" style={{ color: "skyblue" }} />
            <span className="sidebarListItemText">Friends</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" style={{ color: "skyblue" }} />
            <span className="sidebarListItemText">Messenger</span>
          </li>
          <li className="sidebarListItem">
            <VideoLibraryIcon
              className="sidebarIcon"
              style={{ color: "skyblue" }}
            />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <StorefrontIcon
              className="sidebarIcon"
              style={{ color: "skyblue" }}
            />
            <span className="sidebarListItemText">Marketplace</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" style={{ color: "skyblue" }} />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" style={{ color: "skyblue" }} />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem" onClick={logoutToggle}>
            <ExpandCircleDownRoundedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Show more</span>
          </li>
          <li>
            <h5
              id="logout"
              className={showHidden ? "logout-show" : "logout-hide"}
              onClick={confirmLogout}
            >
              Logout
            </h5>
          </li>
          <li>
            <select
              id="select-mode"
              className={showHidden ? "mode-show" : "mode-hide"}
              onChange={getSelectedMode}
              value={mode}
              style={{
                background: mode === "day" ? "white" : "black",
                color: mode === "night" ? "grey" : "",
              }}
            >
              <option className="day-mode" value="day">
                Day
              </option>
              <option className="night-mode" value="night">
                Night
              </option>
            </select>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <h4 style={{ color: "grey" }}>Your shortcuts</h4>
        <ul className="sidebarFriendList">
          {Users.filter((user) => {
            return user.id > 2 && user.id < 6;
          }).map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
