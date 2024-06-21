
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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

function JobSeekerProfile() {
  const userId=localStorage.getItem('userId');
  const token=localStorage.getItem('accessToken');
  const [industry, setIndustry] = useState('');
  const [subIndustry, setSubIndustry] = useState('');
  const [subIndustryOptions, setSubIndustryOptions] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const getUserIndustryAndSubIndustry = async () => {
      try {
        const response = await axios.get('/api/getindustry',{
                   headers: {
                     'Authorization': `Bearer ${token}`,
                      "Content-Type": "application/json"
                  }});
        setIndustry(response.data.industry);
        setSubIndustry(response.data.subIndustry);
      } catch (error) {
        console.error('Error retrieving user industry and subIndustry:', error);
      }
    };
    getUserIndustryAndSubIndustry();
  }, []);

  const handleIndustryChange = (event) => {
    const selectedIndustry = event.target.value;
    setIndustry(selectedIndustry);
    setSubIndustryOptions(industries[selectedIndustry]);
  };

  const handleSubIndustryChange = (event) => {
    setSubIndustry(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/profile/${userId}`, {
        industry,
        subIndustry,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
           "Content-Type": "application/json"
       }});
      toast.success('Industry and subIndustry updated successfully!');
      setIsEditMode(false);
    } catch (error) {
      toast.error('Error updating user industry and subIndustry:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setSubIndustryOptions(industries[industry]);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setIndustry(industry);
    setSubIndustry(subIndustry);
  };

  return (
    
        <div className="container border p-4">
        <h5 className="text-center ">What type of jobs are you most interested in?</h5>
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label htmlFor="industry">Industry:</label>
              <select id="industry" value={industry} onChange={handleIndustryChange} className="form-control">
                <option value="">Select Industry</option>
                {Object.keys(industries).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subIndustry ">Sub-Industry:</label>
              <select id="subIndustry" value={subIndustry} onChange={handleSubIndustryChange} className="form-control">
                <option value="">Select Sub-Industry</option>
                {subIndustryOptions.map((subIndustry, index) => (
                  <option key={index} value={subIndustry}>{subIndustry}</option>
                ))} className="bold"
              </select>
            </div>
            <div className="button-container d-flex">
              <button type="submit" className="btn btn-info m-2 w-50">Save</button>
              <button type="button" className="btn btn-danger m-2 w-50" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
          
          ) : (
  
      <div className=" border " >
        <div className="profile-details m-2">
          <p><span className="fw-bold">Industry:</span> {industry}</p>
          <p><span className="fw-bold">Sub-Industry:</span> {subIndustry}</p>
        </div>
        <div className="m-2">
        <button className="btn btnstyle1 w-100 " onClick={handleEditClick}>Edit</button>
        </div>
      </div>
    
          
          )}
        </div>
     
  );
 
}

export default JobSeekerProfile;

