import "./register.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        formData
      );
      console.log(response);
    } catch (error) {
      console.error("Kullanıcı kayıt hatası:", error);
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Facebook</h3>
          <div className="registerLeftDesc">
            Facebook tanıdıklarınla iletişim kurmanı
            <br /> ve hayatında olanları paylaşmanı <br />
            sağlar
          </div>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <form className="registerForm" onSubmit={handleFormSubmit}>
              <div className="registerUsername">
                <input
                  className="registerInput"
                  placeholder="Username"
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="registerEmail">
                <input
                  className="registerInput"
                  placeholder="Email or Phone number"
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="registerPassword">
                <input
                  className="registerInput"
                  placeholder="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="registerPassword">
                <input
                  className="registerInput"
                  placeholder="Retype-password"
                  type="password"
                  id="rePassword"
                  value={formData.rePassword}
                  onChange={handleInputChange}
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="registerSubmit">
                <input id="registerBtn" type="submit" value="Sign Up" />
              </div>
              <hr className="registerHr" />
              <div className="registerLoginAc">
                <label htmlFor="reg-btn">
                  <Link style={{ textDecoration: "none" }} to="/login">
                    <span>Already have an account?</span>
                  </Link>
                </label>
              </div>
            </form>
          </div>
          <div className="registerRightDesc">
            <b>Create a Page </b> for a celebrity, brand or business.
          </div>
        </div>
      </div>
    </div>
  );
}
