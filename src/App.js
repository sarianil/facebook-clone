import "./App.css";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import React, { useState, useEffect } from "react";
import { fetchUser, fetchFlowData } from "./redux/thunk";
import Home from "./pages/home/Home";

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.social.currentUser);
  const status = useSelector((state) => state.social.status);
  const error = useSelector((state) => state.social.error);
  const flowData = useSelector((state) => state.flowdata.flowData);

  useEffect(() => {
    console.log("fetchUser çağrılıyor");
    dispatch(fetchUser());
  }, []);
  useEffect(() => {
    dispatch(fetchFlowData());
  }, []);
  console.log(flowData);
  console.log("Redux State:", { currentUser, flowData });
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// var showCreatePost = useRef();
// const dataToParent = (data) => {
//   showCreatePost.current = data;
//   console.log(showCreatePost)
// }
// const [showCreatePost,setShowCreatePost] = useState(childState);
