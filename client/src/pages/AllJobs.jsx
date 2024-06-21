import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


    const AllJobs = () => {
      const token = localStorage.getItem('accessToken');
      const [jobs, setJobs] = useState([]);
      useEffect(() => {
        
        try {
          axios
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
          
            <div className="background row">
              {jobs.jobs &&
                jobs.jobs.map((element) => {
                  return (
                    <div className=" col-md-4  m-2 container rounded shadow text-center" key={element._id}>
                      <h5>{element.title}</h5>
                      <p>{element.subIndustry}</p>

                    <Link to={`/job/${element._id}`} className="btn btnstyle1 mb-2" > Job Details</Link>
                    </div>
                  );
                })}
           
           </div>
      );
    };
    

export default AllJobs;


