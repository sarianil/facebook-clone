import "./home.css";
import Feed from "../../components/feed/Feed";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Home({ showCreatePost }) {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/currentuser");
      console.log("Veri başarıyla alındı:", response.data);
      return response.data;
    } catch (error) {
      console.error("Veri alınırken hata oluştu:", error);
      throw error;
    }
  };

  fetchData();

  return (
    <>
      <div className={showCreatePost ? "halfVisualHome" : "fullVisualHome"}>
        <Topbar />

        <div className="homeContainer">
          <Sidebar />
          <Feed />
          <Rightbar />
        </div>
      </div>
    </>
  );
}
