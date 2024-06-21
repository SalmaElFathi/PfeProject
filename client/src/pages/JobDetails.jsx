import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDataContext } from '../contexts/index';
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [job, setJob] = useState({});
  const [role, setRole] = useState(null);

  const { server } = useDataContext();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobRes = await axios.get(`http://localhost:8000/api/job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setJob(jobRes.data.job);
      } catch (error) {
        console.log("Error fetching job details:", error);
      }
    };

    const fetchProfileInfo = async () => {
      try {
        const profileRes = await axios.get(`http://localhost:8000/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setRole(profileRes.data.user.role);
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    };

    fetchJobDetails();
    fetchProfileInfo();
  }, [id, userId, token]);


  const handleCreateChat = async () => {
    await server.emit('createOneToOneChat', { user_id_1: userId, user_id_2: job.postedBy, date: new Date().toISOString() })
  }

  return (
    <section className="container-fluid  vh-100 bg-secondary d-flex align-items-center justify-content-center ">
      <div className="container bg-light w-50">
        <h2 className="text-center">Job Details</h2>
        <div className="banner m-3">

          <h5>Title: <span className="text-secondary">{job.title}</span></h5>

          <h5> Industry: <span className="text-secondary">{job.industry}</span></h5>
          <h5> subIndustry: <span className="text-secondary">{job.subIndustry}</span></h5>


          <h5>Location: <span className="text-secondary">{job.location}</span> </h5>

          <h5> Description: <span className="text-secondary">{job.description}</span></h5>
          <h5>
            Job Posted On: <span className="text-secondary">{job.jobPostedOn}</span>
          </h5>
          <h5> Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}</h5><br></br>


          {role === "jobseeker" ?  (
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Link to={`/application/${job._id}`}><button className="btn btn-info w-100">Apply Now</button></Link>
              <h5>Or</h5>
              <button onClick={handleCreateChat} className="btn btn-info w-100">Chat With Employer</button>
            </div>
          ):(<></>)}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
