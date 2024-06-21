import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import RejoinLogo from "../components/RejoinLogo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated,setIsAuthenticated]=useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        userEmail: email,
        password: password,
      });

      console.log("Response from backend:", response.data);

      if (response.data.accessToken && response.data.userId) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role",response.data.role);
        setIsAuthenticated(true);
        setUser(response.data.userId);
        navigate("/");
      } else {
        setErrorMessage("Incorrect email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  }

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundColor:
          " linear-gradient(205deg, rgb(79, 70, 229), rgb(176, 5, 174))",
      }}
    >
      <div
        className="position-absolute top-0 start-50 translate-middle-x mt-5"
        style={{ zIndex: 1 }}
      >
        <img
          src={RejoinLogo}
          alt="ReJoin Logo"
          style={{ width: "250px", height: "250px" }}
        />
      </div>
      <div
        className="card p-4 mt-5"
        style={{ width: "400px", borderRadius: "20px", zIndex: 2 }}
      >
        <div className="text-center mb-4">
          <h2 style={{ color: "#4F4F4F" }}>Welcome Back!</h2>
        </div>
        {errorMessage && <h6 className="text-danger">{errorMessage}</h6>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: "50px" }}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: "50px" }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              borderRadius: "50px",
              backgroundColor: "#0066FF",
              borderColor: "#0066FF",
            }}
          >
            Get Started
          </button>
        </form>
        <div className="text-center mt-3">
          <Link
            to="/register"
            className="text-primary"
            style={{ textDecoration: "none" }}
          >
            Create Account
          </Link>
          {" | "}
          <Link
            to="/forgotPassword"
            className="text-primary"
            style={{ textDecoration: "none" }}
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
