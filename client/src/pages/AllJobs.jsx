import React, { useEffect, useState } from "react";
import apiClient from '../config/apiClient';
import { Link } from "react-router-dom";
import "../styles/alljobs.css";

    const AllJobs = () => {
      const token = localStorage.getItem('accessToken');
      const [jobs, setJobs] = useState([]);
      useEffect(() => {
        
        try {
          apiClient
            .get("http://localhost:8000/api/job/getall", {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then((res) => {
              setJobs(res.data);
            });
        } catch (error) {
          console.log(error);
        }
      }, []);
      
    
      return (
          
         <section className="allJobs">
      <div className="container">
        <h1 className="allJobs-title ">ALL AVAILABLE JOBS</h1>
        <div className="allJobs-list">
          {jobs.jobs &&
            jobs.jobs.map((job) => (
              <div className="allJobs-card" key={job._id}>
                <h5 className="allJobs-card-title">{job.title}</h5>
                <p className="allJobs-card-subIndustry">{job.subIndustry}</p>
                <Link
                  to={`/job/${job._id}`}
                  className="allJobs-card-detailsLink"
                >
                  Job Details
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
      );
    };
    

export default AllJobs;

