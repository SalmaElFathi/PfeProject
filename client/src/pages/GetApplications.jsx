import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import '../components/Dashboard.css'

const GetApplications = () => {
  const token = localStorage.getItem('accessToken');
  const [applications, setApplications] = useState([]);




const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));
const payload = JSON.parse(jsonPayload);
const role = payload.role;



  useEffect(() => {
    try {
      if (role === "employer") {
        axios
          .get("http://localhost:8000/api/application/employer/getall", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else if (role === "jobseeker"){
        axios
          .get("http://localhost:8000/api/application/jobseeker/getall", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }else {console.log('role not defined ');}
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:8000/api/application/delete/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          toast.success(res.data.message);

          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const acceptApplication = (id) => {
    try {
      axios.post(`http://localhost:8000/api/application/accept/${id}`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((res) => {
        toast.success(res.data.message);
        setApplications(prevApplications =>
          prevApplications.filter(application => application._id !== id)
        );
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const rejectApplication = (id) => {
    try {
      axios.post(`http://localhost:8000/api/application/reject/${id}`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((res) => {
        toast.success(res.data.message);
        setApplications(prevApplications =>
          prevApplications.filter(application => application._id !== id)
        );
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="my_applications background rounded">
      {role === "jobseeker" ? (
        <div className=" border">
         
          {applications.length <= 0 ? (
            <>
              {" "}
              <h4>No Applications Found</h4>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <div className="job_seeker_card container  shadow rounded border mb-3" >
              <div className="detail ">
                <p>
                  <span className="fw-bold">Name:</span> {element.name}
                </p>
                <p>
                  <span className="fw-bold">Email:</span> {element.email}
                </p>
                <p>
                  <span className="fw-bold">Phone:</span> {element.phone}
                </p>
                <p>
                  <span className="fw-bold">Address:</span> {element.address}
                </p>
                <p>
                  <span className="fw-bold">  CoverLetter:</span> {element.coverLetter}
                </p>
              </div>
             <div className="resume ">
                <p><a href={`http://localhost:8000/uploads/${element.resume}`} target="_blank" rel="noopener noreferrer">Download resume</a></p>
              </div>
              <div className="btn_area ">
                <button className="btn btn-secondary mb-2"  onClick={() => deleteApplication(element._id)}>
                  Delete 
                </button>
              </div>
            </div>
              );
            })
          )}
        </div>
      ) : (
        <div >
         
          {applications.length <= 0 ? (
            <>
              <h4>No Applications Found</h4>
            </>
          ) : (
            applications.map((element) => {
              return (
                <div className="job_seeker_card  p-2 border rounded container shadow mb-3">
        <div className="detail ">
          <p>
            <span className="fw-bold ">Name:</span> {element.name}
          </p>
          <p>
            <span className="fw-bold ">Email:</span> {element.email}
          </p>
          <p>
            <span className="fw-bold ">Phone:</span> {element.phone}
          </p>
          <p>
            <span className="fw-bold">Address:</span> {element.address}
          </p>
          <p>
            <span className="fw-bold ">CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        <div className="resume m-2">
        <p><a href={`http://localhost:8000/uploads/${element.resume}`} target="_blank" rel="noopener noreferrer">Download resume</a></p>
        </div>
        <div class="d-flex">
          <button class="btnstyle1 btn  w-50 m-2"  onClick={() => acceptApplication(element._id)}>accept</button>
          <button class="btn btn-secondary w-50 m-2"  onClick={() => rejectApplication(element._id)}>reject</button>
        </div>
      </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default GetApplications;
