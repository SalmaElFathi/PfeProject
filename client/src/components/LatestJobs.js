import React, { useState, useEffect } from 'react';
import apiClient from '../config/apiClient';
import { Link } from "react-router-dom";

const LatestJobs = () => {
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await apiClient.get('http://localhost:8000/api/latest-jobs');
        setLatestJobs(response.data);
      } catch (error) {
        console.error('Error fetching latest jobs:', error);
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <div className="bg-light">
    <h2 className="input-color text-center" style={{color:'rgb(39, 30, 163)'}}>Our Latest Jobs</h2>
    <div className=" bg-light m-5">
      <div className="row">
        {latestJobs.map(job => (
          <div className="col-md-3 mb-2" key={job._id}>
            <div className="card shadow align-items-center content-type">
              <strong>{job.title}</strong>
              <p>{job.description}</p>
              <Link to={`/job/${job._id}`} className="btn btnstyle1 mb-2">Job Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
};

export default LatestJobs;
