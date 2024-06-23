import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import photo from "../components/Registerumage.png";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [inputs, setInputs] = useState({
    userEmail: "",
    password: "",
    repeatPassword: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (inputs.password !== inputs.repeatPassword) {
      setErrorMessage(
        "Passwords do not match. Please make sure the passwords match."
      );
      setSuccessMessage("");
      return;
    }

    const { repeatPassword, ...dataToSend } = inputs;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        dataToSend
      );
      if (response && response.data) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        setInputs({
          userEmail: "",
          password: "",
          repeatPassword: "",
          role: "",
        });

        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.role);

        Navigate("/profile");
      } else {
        setErrorMessage("Error registering user. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(
          "An error occurred during registration. Please try again."
        );
      }
      setSuccessMessage("");
    }
  };

  return (
      <div
      className="container-fluid vh-100"
      style={{ backgroundColor: "#d8c6fa;" }}
    >
      <div className="row align-items-center justify-content-center h-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card p-5 shadow" style={{ borderRadius: "20px" }}>
            <div className="row">
              <div className="col-md-6 d-none d-md-block">
                <img
                  src={photo}
                  alt="Job Seekers and Employers"
                  className="img-fluid"
                  style={{ borderRadius: "20px", paddingTop: "50px" }}
                />
              </div>
              <div className="col-md-6">
                <div className="text-center mb-4">
                  <h2 style={{ color: "#4F4F4F" }}>Sign Up</h2>
                </div>
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <form>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      id="userEmail"
                      name="userEmail"
                      value={inputs.userEmail}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: "50px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={inputs.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: "50px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Repeat Password"
                      id="repeatPassword"
                      name="repeatPassword"
                      value={inputs.repeatPassword}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: "50px" }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Register as:</label>
                    <div className="d-flex align-items-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="job-seeker"
                          name="role"
                          value="jobseeker"
                          onChange={handleChange}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="job-seeker"
                        >
                          <i className="bi bi-person"></i> Job Seeker
                        </label>
                      </div>
                      <div className="form-check form-check-inline ms-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="employer"
                          name="role"
                          value="employer"
                          onChange={handleChange}
                          required
                        />
                        <label className="form-check-lock" htmlFor="employer">
                          <i className="bi bi-building"></i> Employer
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btnstyle1 w-100 mb-3"
                    style={{
                      borderRadius: "50px",
                    }}
                    onClick={handleClick}
                  >
                    Register
                  </button>
                  <div className="text-center">
                    already have an account?&nbsp;
                    <Link
                      to="/"
                      className="text-secondly"
                      style={{
                        textDecoration: "none",
                        color: "rgb(39, 30, 163)",
                      }}
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;