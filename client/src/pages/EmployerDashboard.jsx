import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar.jsx";
import "../components/Dashboard.css";
import EmployerProfileUpdate from "./EmployerProfileUpdate.jsx";
import MyJobs from "./MyJobs.jsx";
import GetApplications from "./GetApplications.jsx";
import Postjob from "./PostOffre.jsx";
import AllJobs from "./AllJobs.jsx";
import { Modal, Button } from "react-bootstrap";

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [Bio, setBio] = useState("");

  const [activeSection, setActiveSection] = useState("profile");

  const [show, setShow] = useState(false);

  const fetchProfileInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/profile/${userId}`
      );
      const { username, Bio, profilePicture } = response.data.user;
      setUsername(username);
      setProfilePicture(profilePicture);
      setBio(Bio);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchProfileInfo(userId);
  }, [userId]);

  const profileUrl = `http://localhost:8000/uploads/${profilePicture}`;
  const handlePostSuccess = () => {
    setActiveSection("jobs");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <EmployerProfileUpdate />;
      case "Myjobs":
        return <MyJobs />;
      case "postJob":
        return <Postjob onPostSuccess={handlePostSuccess} />;
      case "applications":
        return <GetApplications />;
      case "jobs":
        return <AllJobs />;
      default:
        return <EmployerProfileUpdate />;
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
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
    
    <div  className="dash_container " >
      <NavBar />
      
      <div className="d-flex dash" >
        <div className="left-section m-3  border w-25 p-3" >
          <div >
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
              <br />
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
                onClick={() => setActiveSection("Myjobs")}
              >
                <i className="bi bi-briefcase-fill bi-lg text-info"></i> My Jobs
              </label>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("postJob")}
              >
                <i className="bi bi-briefcase-fill bi-lg text-info"></i> Post a
                Job
              </label>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("jobs")}
              >
                <i className="bi bi-briefcase-fill bi-lg text-info"></i> All
                Jobs
              </label>
            </div>
            <div>
              <label
                htmlFor="name"
                className="icon mb-2"
                onClick={() => setActiveSection("applications")}
              >
                <i className="bi bi-person-fill bi-lg text-info"></i> Job
                Seekers Applications
              </label>
            </div>
            <div>
              <label htmlFor="name" className="icon mb-2" onClick={handleShow}>
                <i className="bi bi-trash-fill bi-lg text-danger"></i> Delete
                Account
              </label>
            </div>
          </div>
        </div> 
        <div className="right-section  background w-75  m-3 ">{renderSection()}</div>
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
