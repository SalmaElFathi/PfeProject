import React, {  useState } from "react";
import apiClient from '../config/apiClient';
import toast from "react-hot-toast";

  const Postjob = ({ onPostSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salaryFrom, setSalaryFrom] = useState('');
    const [salaryTo, setSalaryTo] = useState('');
    const [fixedSalary, setFixedSalary] = useState('');
    const [salaryType, setSalaryType] = useState('default');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedSubIndustry, setSelectedSubIndustry] = useState('');
  
    const handleIndustryChange = (event) => {
      setSelectedIndustry(event.target.value);
      setSelectedSubIndustry('');
    };
  
    const handleSubIndustryChange = (event) => {
      setSelectedSubIndustry(event.target.value);
    };
  
    const handleJobPost = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('accessToken');
  
      const jobData = {
        title,
        description,
        location,
        industry: selectedIndustry,
        subIndustry: selectedSubIndustry,
      };
      if (salaryType === 'Fixed Salary') {
        jobData.fixedSalary = fixedSalary;
        setSalaryFrom('');
        setSalaryTo('');
      } else if (salaryType === 'Ranged Salary') {
        jobData.salaryFrom = salaryFrom;
        jobData.salaryTo = salaryTo;
        setFixedSalary('');
      } else {
        setSalaryFrom('');
        setSalaryTo('');
        setFixedSalary('');
      }
  
      try {
        const response = await apiClient.post(
          'http://localhost:8000/api/job/post',
          jobData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message);
        onPostSuccess();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error posting job');
      }
    };
  
    const industries = {
      Technology: ['Software Development', 'Cybersecurity', 'Artificial Intelligence', 'Data Science', 'Cloud Computing'],
      Healthcare: ['Hospitals & Clinics', 'Pharmaceuticals', 'Medical Devices', 'Biotechnology', 'Health Insurance'],
      Finance: ['Banking', 'Investment Management', 'Insurance', 'Financial Technology (FinTech)', 'Real Estate'],
      Manufacturing: ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Aerospace'],
      Retail: ['E-commerce', 'Fashion & Apparel', 'Grocery Stores', 'Luxury Goods', 'Home Improvement']
    };
  return (
    <>
    <div className=" border   rounded " >
      <div className="container  p-3 rounded">
        <h3 style={{color:'rgb(39, 30, 163)'}}>Post New Job</h3>
        <form onSubmit={handleJobPost}>
          <div className="mb-3">
            <input
              type="text"
              id="jobTitle"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              required   style={{backgroundColor:' #f2f2f7',
                color: 'black' ,border:'none'
              }}
            />
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              id="jobLocation"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              required  style={{backgroundColor:' #f2f2f7',
                color: 'black' ,border:'none'
              }}
            />
          </div>
          <div className="form-group mb-3">
                    <select id="industry" className="form-control mb-2" value={selectedIndustry} onChange={handleIndustryChange} required  style={{backgroundColor:' #f2f2f7',
                color: 'black' ,border:'none'
              }}>
                        <option value="" disabled >Select Industry</option>
                        {Object.keys(industries).map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>

                    {selectedIndustry && (
                        <select id="subIndustry" className="form-control mb-3" value={selectedSubIndustry} onChange={handleSubIndustryChange} required>
                            <option value="" disabled>Select Sub Industry</option>
                            {industries[selectedIndustry].map((subIndustry) => (
                                <option key={subIndustry} value={subIndustry}>{subIndustry}</option>
                            ))}
                        </select>
                    )}
                </div>
          <div className="mb-3">
            <select
              id="salaryType"
              className="form-select"
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              required style={{backgroundColor:' #f2f2f7',
                color: 'black' ,border:'none'
              }}
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
          </div>
          <div className="mb-3">
            {salaryType === "default" ? (
              <p className="text-danger">Please provide Salary Type *</p>
            ) : salaryType === "Fixed Salary" ? (
              <div>
                <input
                  type="number"
                  id="fixedSalary"
                  className="form-control"
                  placeholder="Enter Fixed Salary"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="row">
                <div className="col">
                  <input
                    type="number"
                    id="salaryFrom"
                    className="form-control"
                    placeholder="Salary From"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    id="salaryTo"
                    className="form-control"
                    placeholder="Salary To"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mb-3">
            <textarea
              id="jobDescription"
              className="form-control"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              required  style={{backgroundColor:' #f2f2f7',
                color: 'black' ,border:'none'}}
            />
          </div>
          <button type="submit" className="btn  w-100" style={{backgroundColor:'rgb(39, 30, 163)',color:'white'}}>Create Job</button>
        </form>
      </div>
    </div>
  </>
  
  );
};

export default Postjob;
