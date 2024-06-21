import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDataContext } from '../contexts/index'

const industries = {
  Technology: ['Software Development', 'Cybersecurity', 'Artificial Intelligence', 'Data Science', 'Cloud Computing'],
  Healthcare: ['Hospitals & Clinics', 'Pharmaceuticals', 'Medical Devices', 'Biotechnology', 'Health Insurance'],
  Finance: ['Banking', 'Investment Management', 'Insurance', 'Financial Technology (FinTech)', 'Real Estate'],
  Manufacturing: ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Aerospace'],
  Retail: ['E-commerce', 'Fashion & Apparel', 'Grocery Stores', 'Luxury Goods', 'Home Improvement']
};

const MyJobs = () => {
  const { server } = useDataContext();
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const fetchProfileInfo = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8000/api/profile/${userId}`);
      setRole(response.data.user.role);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) { navigate('/'); }
        const { data } = await axios.get(
          "http://localhost:8000/api/job/getmyjobs",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await server.emit('jobUpdate', updatedJob);
    toast.success('Job updated successfully!');
    setEditingMode(null);

  
  };

  const handleDeleteJob = async (jobId) => {

    await server.emit('jobDelete', jobId);
    toast.success('Job Deleted successfully!');
    setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

   
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="App">
      <div className="myJobs background">
        {myJobs.length > 0 ? (
            <>
            <div>
              {myJobs.map((element) => (
                <div className="card mb-3" key={element._id}>
                  <div className="card-body">
                    <div className="input-group mt-2">
                      <div className="input-group-prepend ">
                        <span className="input-group-text rounded-0">Title</span>
                      </div>
                      <input
                        type="text"
                        className="form-control input" 
                        disabled={editingMode !== element._id}
                        value={element.title}
                        onChange={(e) =>
                          handleInputChange(element._id, "title", e.target.value)
                        }
                      />
                    </div>
  
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text rounded-0">Industry</span>
                          </div>
                          <select
                            className="form-select"
                            value={element.industry || ''}
                            onChange={(e) =>
                              handleInputChange(element._id, "industry", e.target.value)
                            }
                            disabled={editingMode !== element._id}
                          >
                            <option value="" disabled>Select Industry</option>
                            {Object.keys(industries).map((industry) => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {element.industry && (
                        <div className="col-md-6">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text rounded-0">Sub-Industry</span>
                            </div>
                            <select
                              className="form-select"
                              value={element.subIndustry || ''}
                              onChange={(e) =>
                                handleInputChange(element._id, "subIndustry", e.target.value)
                              }
                              disabled={editingMode !== element._id}
                            >
                              <option value="" disabled>Select Sub Industry</option>
                              {industries[element.industry].map((subIndustry) => (
                                <option key={subIndustry} value={subIndustry}>{subIndustry}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
  
                    <div className="row  mt-2">
                      <div className="col-md-6">
                        <div className="input-group ">
                          <div className="input-group-prepend">
                            <span className="input-group-text rounded-0">Salary</span>
                          </div>
                          {element.fixedSalary ? (
                            <input
                              type="number"
                              className="form-control rounded-0" 
                              disabled={editingMode !== element._id}
                              value={element.fixedSalary}
                              onChange={(e) =>
                                handleInputChange(element._id, "fixedSalary", e.target.value)
                              }
                            />
                          ) : (
                            <div className="row">
                              <div className="col">
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={editingMode !== element._id}
                                  value={element.salaryFrom}
                                  onChange={(e) =>
                                    handleInputChange(element._id, "salaryFrom", e.target.value)
                                  }
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={editingMode !== element._id}
                                  value={element.salaryTo}
                                  onChange={(e) =>
                                    handleInputChange(element._id, "salaryTo", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text rounded-0">Expired</span>
                          </div>
                          <select
                            className="form-select"
                            value={element.expired}
                            onChange={(e) =>
                              handleInputChange(element._id, "expired", e.target.value)
                            }
                            disabled={editingMode !== element._id}
                          >
                            <option value={true}>TRUE</option>
                            <option value={false}>FALSE</option>
                          </select>
                        </div>
                      </div>
                    </div>
  
                    <div className="mt-2">
                    <label className="form-label  blue-color fw-bold">Description:</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={element.description}
                      disabled={editingMode !== element._id}
                      onChange={(e) =>
                        handleInputChange(element._id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <label className="form-label blue-color fw-bold">Location:</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={element.location}
                      disabled={editingMode !== element._id}
                      onChange={(e) =>
                        handleInputChange(element._id, "location", e.target.value)
                      }
                    />
                  </div>
  
                    <div className="d-flex justify-content-between mt-2">
                      {editingMode === element._id ? (
                        <div className="d-flex w-100">
                          <button onClick={() => handleUpdateJob(element._id)}  className="btn btnstyle1 w-50 m-2">Update </button>
                          <button onClick={() => handleDisableEdit()}  className="btn btn-secondary w-50 m-2">Cancel</button>
                        </div>
                      ) : (<div className="d-flex w-100">
                        <button  onClick={() => handleEnableEdit(element._id)}  className="btn btnstyle1 w-50 m-2" >Edit</button>
                        <button onClick={() => handleDeleteJob(element._id)} className="btn btn-secondary w-50 m-2" >Delete</button>
                        </div>
                      
                      )}
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>No jobs found.</div>
        )}
      </div>
    </div>
  );
}



export default MyJobs;
