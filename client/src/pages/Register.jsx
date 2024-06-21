
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    userEmail: "",
    password: "",
    repeatPassword: "",
    role:""
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
      setErrorMessage("Passwords do not match. Please make sure the passwords match.");
      setSuccessMessage("");
      return;
    }

    const { repeatPassword, ...dataToSend } = inputs;

    try {
      const response = await axios.post("http://localhost:8000/api/register", dataToSend);
      if (response && response.data) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        setInputs({
          userEmail: "",
          password: "",
          repeatPassword: "",
          role:""
        });

        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('role', response.data.role);

        Navigate('/profile');
      } else {
        setErrorMessage("Error registering user. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An error occurred during registration. Please try again.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center bg-secondary" style={{ height: "100vh", backgroundColor: "#f0f0f0" }}>
      <div className="card m-2" style={{ width: "45%", backgroundColor: "#fff" }}>
        <div className="card-body">
          <h3 className="card-title text-center text-secondary">Sign Up</h3>
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
              <label htmlFor="userEmail" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="userEmail"
                name="userEmail"
                value={inputs.userEmail}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="repeatPassword" className="form-label">Repeat Password:</label>
              <input
                type="password"
                className="form-control"
                id="repeatPassword"
                name="repeatPassword"
                value={inputs.repeatPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
                <label className="form-label">Register as :</label>
                <div>
                    <input type="radio" id="job-seeker" name="role" value="jobseeker" onChange={handleChange} required />
                    <label htmlFor="job-seeker" style={{ marginRight: '20px',marginLeft: '5px' }}>Job Seeker</label> 
                    <input type="radio" id="employer" name="role" value="employer" onChange={handleChange} />
                    <label htmlFor="employer" style={{ marginRight: '20px',marginLeft: '5px' }}>Employer</label>
                </div>
            </div>


            <p className="mt-3 text-center">
              Already have an account? <Link to="/" className="text-info">Login</Link>
            </p>
            <button className="btn btn-info w-100" onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
