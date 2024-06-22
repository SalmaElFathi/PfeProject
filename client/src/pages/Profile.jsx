import React, { useState, useEffect } from "react";
import "../components/profile.css";
import apiClient from "../config/apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { subscribeToNotifications } from "../contexts/pushNotificationService";
const ProfileUpdate = () => {
  const userId = localStorage.getItem("userId");
  const [role, setRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");
  const [Bio, setBio] = useState("");
  const [industry, setIndustry] = useState("");
  const [subIndustry, setSubIndustry] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const industries = {
    Technology: [
      "Software Development",
      "Cybersecurity",
      "Artificial Intelligence",
      "Data Science",
      "Cloud Computing",
    ],
    Healthcare: [
      "Hospitals & Clinics",
      "Pharmaceuticals",
      "Medical Devices",
      "Biotechnology",
      "Health Insurance",
    ],
    Finance: [
      "Banking",
      "Investment Management",
      "Insurance",
      "Financial Technology (FinTech)",
      "Real Estate",
    ],
    Manufacturing: [
      "Automotive",
      "Electronics",
      "Food & Beverage",
      "Textile",
      "Aerospace",
    ],
    Retail: [
      "E-commerce",
      "Fashion & Apparel",
      "Grocery Stores",
      "Luxury Goods",
      "Home Improvement",
    ],
  };

  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSubIndustry, setSelectedSubIndustry] = useState("");

  const handleIndustryChange = (event) => {
    setSelectedIndustry(event.target.value);
    setSelectedSubIndustry("");
  };

  const handleSubIndustryChange = (event) => {
    setSelectedSubIndustry(event.target.value);
  };

  const fetchProfileInfo = async (userId) => {
    try {
      const response = await apiClient.get(
        `http://localhost:8000/api/profile/${userId}`
      );
      const { username, Bio, industry, subIndustry, profilePicture, role } =
        response.data.user;
      setRole(role);
      setUsername(username);
      setBio(Bio);
      setIndustry(industry);
      setSubIndustry(subIndustry);
      setProfilePicture(profilePicture);
      setSelectedIndustry(industry);
      setSelectedSubIndustry(subIndustry);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    fetchProfileInfo(userId);
  }, [userId]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleImgChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("username", username);
      formData.append("Bio", Bio);
      formData.append("industry", selectedIndustry);
      formData.append("subIndustry", selectedSubIndustry);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await apiClient.put(`http://localhost:8000/api/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (role === "jobseeker") {
        await subscribeToNotifications(selectedIndustry, selectedSubIndustry);
      }

      toast.success("Profile updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update profile. Please try again later.");
    }
  };

  const profileUrl = "http://localhost:8000/uploads/" + profilePicture;

  return (
    <div className="vh-100 w-100 bg-secondary d-flex justify-content-center align-items-center">
      <form
        className="profile-form container m-4 "
        onSubmit={handleSubmit}
        style={{ width: "45%" }}
      >
        <div className="head form-group text-center">
          <h3 className="mb-4 text-secondary">Modify Profile</h3>
          <img
            src={profileUrl}
            alt="profile"
            className="profile-img rounded-circle mb-3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name" className="mb-2">
            Name :
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="bio" className="mb-2">
            Bio :
          </label>
          <textarea
            id="bio"
            className="form-control"
            value={Bio}
            onChange={handleBioChange}
          />
        </div>
        <br></br>

        {role === "jobseeker" && (
          <>
            <div className="form-group">
              <label htmlFor="industry" className="mb-2">
                Job Preferences :{" "}
              </label>

              <select
                id="industry"
                className="form-control mb-2"
                value={selectedIndustry}
                onChange={handleIndustryChange}
                required
              >
                <option value="" disabled>
                  Select Industry
                </option>
                {Object.keys(industries).map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>

              {selectedIndustry && (
                <select
                  id="subIndustry"
                  className="form-control"
                  value={selectedSubIndustry}
                  onChange={handleSubIndustryChange}
                  required
                >
                  <option value="" disabled>
                    Select Sub Industry
                  </option>
                  {industries[selectedIndustry].map((subIndustry) => (
                    <option key={subIndustry} value={subIndustry}>
                      {subIndustry}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <br></br>
          </>
        )}
        <div className="form-group">
          <label htmlFor="profilePicture" className="mb-2">
            Profile Picture:
          </label>
          <input
            type="file"
            id="profilePicture"
            className="form-control-file"
            accept="image/*"
            onChange={handleImgChange}
          />
        </div>
        <br></br>

        <div className="form-group">
          <button type="submit" className="btn btn-info w-100 mb-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
