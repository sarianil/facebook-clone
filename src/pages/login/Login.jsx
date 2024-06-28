import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const loginUser = () => {
    axios
      .post("http://localhost:5000/login", formData)
      .then((response) => {
        console.log(response);

        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log("kullanıcı kimlik");
        console.error(error);
      });
  };
  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    loginUser();
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Facebook</h3>
          <div className="loginLeftDesc">
            Facebook tanıdıklarınla iletişim kurmanı <br /> ve hayatında
            olanları paylaşmanı
            <br /> sağlar
          </div>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <form action="#" className="loginForm">
              <div className="loginUsername">
                <input
                  onChange={handleInputChange}
                  className="loginInput"
                  placeholder="Email or Phone number"
                  type="text"
                  id="user_mail"
                />
              </div>
              <div className="loginPassword">
                <input
                  onChange={handleInputChange}
                  className="loginInput"
                  placeholder="Password"
                  type="password"
                  id="user_password"
                />
              </div>
              <div className="loginSubmit">
                <input
                  id="loginBtn"
                  type="submit"
                  onClick={handleFormSubmit}
                  value="Log In"
                />
              </div>
              <span>
                <a className="forgetPwd" href="#email?">
                  Forgot your password?
                </a>
              </span>
              <hr className="loginHr" />
              <div className="loginCreateAc">
                <Link to="/register">
                  <input
                    className="loginCreateBtn"
                    type="submit"
                    value="Create new account"
                  />
                </Link>
              </div>
            </form>
          </div>
          <div className="loginRightDesc">
            <b>Create a Page </b> for a celebrity, brand or business.
          </div>
        </div>
      </div>
    </div>
  );
}
