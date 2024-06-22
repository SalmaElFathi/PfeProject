import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from '../config/apiClient';
import "../components/Dashboard.css";
import RejoinLogo from "./RejoinLogo.png";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  let [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bgClass, setBgClass] = useState("");

  const handleScroll = () => {
    if (window.scrollY > 400) {
      setBgClass("bg-light");
    } else {
      setBgClass("");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const token = localStorage.getItem("accessToken");
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      setRole(payload.role);
      setIsAuthenticated(true);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await apiClient.post("http://localhost:8000/api/logout");
      if (response.status === 200) {
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <div className="container-fluid" style={{ padding: 0 }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid">
            <img src={RejoinLogo} alt="ReJoin Logo" className="navbar-logo" />
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-center"
              id="navbarNav"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <strong>
                    <Link
                      to="/"
                      className="nav-link "
                      style={{ color: "rgb(39, 30, 163)" }}
                    >
                      Home
                    </Link>
                  </strong>
                </li>

                {isAuthenticated && (
                  <>
                    {role === "jobseeker" ? (
                      <>
                        <li className="nav-item">
                          <strong>
                            <Link
                              to="/dashboard"
                              className="nav-link "
                              style={{ color: "rgb(39, 30, 163)" }}
                            >
                              My Dashboard
                            </Link>
                          </strong>
                        </li>
                        <li className="nav-item">
                          <strong>
                            <Link
                              to="/job-notifications"
                              className="nav-link "
                              style={{ color: "rgb(39, 30, 163)" }}
                            >
                              Job Notifications
                            </Link>
                          </strong>
                        </li>
                        <li className="nav-item">
                          <strong>
                            <Link
                              to="/chat"
                              className="nav-link "
                              style={{ color: "rgb(39, 30, 163)" }}
                            >
                              Chat
                            </Link>
                          </strong>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="nav-item">
                          <strong>
                            <Link
                              to="/dashboard"
                              className="nav-link"
                              style={{ color: "rgb(39, 30, 163)" }}
                            >
                              My Dashboard
                            </Link>
                          </strong>
                        </li>
                        <li className="nav-item">
                          <strong>
                            <Link
                              to="/chat"
                              className="nav-link "
                              style={{ color: "rgb(39, 30, 163)" }}
                            >
                              Chat
                            </Link>
                          </strong>
                        </li>
                      </>
                    )}
                  </>
                )}

                <li className="nav-item">
                  <strong>
                    <Link
                      to="/contact"
                      className="nav-link "
                      style={{ color: "rgb(39, 30, 163)" }}
                    >
                      Contact Us
                    </Link>
                  </strong>
                </li>
              </ul>
            </div>
            <div className="d-flex" style={{ width: "280px" }}>
              {isAuthenticated ? (
                <>
                  {role === "jobseeker" ? (
                    <button className="btn btnstyle1 w-50 mx-1">
                      <strong>
                        <Link to="/job-apply" className="nav-link">
                          Apply for a Job
                        </Link>
                      </strong>
                    </button>
                  ) : (
                    <button className="btn btnstyle1 w-50 mx-1">
                      <strong>
                        <Link to="/job-post" className="nav-link">
                          Job Post
                        </Link>
                      </strong>
                    </button>
                  )}
                  <button
                    className="btn btn-secondary w-50 mx-1"
                    onClick={handleLogout}
                  >
                    <strong> Log out</strong>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btnstyle1 w-50 mx-1">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </button>
                  <button className="btn btn-secondary w-50 mx-1">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;