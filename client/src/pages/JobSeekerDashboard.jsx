import React, { useState, useEffect } from "react";
import apiClient from '../config/apiClient';
import NavBar from "../components/navBar.jsx";
import "../components/Dashboard.css";
import ProfileUpdate from "./profileUpdate.jsx";
import AllJobs from "./AllJobs.jsx";
import GetApplications from "./GetApplications.jsx";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import JobPreferences from './JobPreferences.jsx';

function Dashboard() {
  const userId = localStorage.getItem("userId");
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [Bio, setBio] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading,setLoading]=useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const fetchProfileInfo = async (userId) => {
    try {
      const response = await apiClient.get(
        `http://localhost:8000/api/profile/${userId}`
      );
      const { username, Bio, profilePicture } = response.data.user;
      setUsername(username);
      setProfilePicture(profilePicture);
      setBio(Bio);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo(userId);
  }, [userId]);
  if (loading) {
    return <div>Loading...</div>;
  }
  const profileUrl = `http://localhost:8000/uploads/${profilePicture}`;

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileUpdate />;
      case "jobs":
        return <AllJobs />;
      case "preferences":
        return <JobPreferences />;
      case "applications":
        return <GetApplications />;
      default:
        return <ProfileUpdate />;
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAccount = async () => {
    try {
      const response = await apiClient.delete(
        `http://localhost:8000/api/delete-account/${userId}`
      );
      if (response.status === 200) {
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setShow(false);
    }
  };
  return (
    <div >
      <NavBar />
      
      <div className=" d-flex dash" >
        <div className="left-section background w-25  m-2 ">
          <div className='container'>
            <div className="text-center">
              <h3>My dashboard</h3>
              <img
                src={profileUrl}
                alt="profile"
                className="profile-img rounded-circle mb-3"
              />
              <h4>{username}</h4>
              <h6>
                <i>{Bio}</i>{" "}
              </h6>{" "}
              <br></br>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("profile")}
              >
                <i className="bi bi-pencil-square bi-lg text-info"></i> Edit
                Profile
              </label>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("jobs")}
              >
                <i className="bi bi-briefcase-fill bi-lg text-info"></i>All Jobs
              </label>
            </div>

            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("applications")}
              >
                <i className="bi bi-briefcase-fill bi-lg text-info"></i> My
                Applications
              </label>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("preferences")}
              >
                <i className="bi bi-heart-fill bi-lg text-info"></i>Job Preferences
              </label>
            </div>
            <div>
              <label htmlFor="name" className="icon mb-2" onClick={handleShow}>
                <i className="bi bi-trash-fill bi-lg text-info"></i> Delete
                Account
              </label>
            </div>
          </div>
        </div>
        <div className="right-section w-75  background m-2">{renderSection()}</div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dashboard;
