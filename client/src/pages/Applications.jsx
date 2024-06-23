import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import apiClient from '../config/apiClient';
import toast from "react-hot-toast";
import '../components/Dashboard.css'

function Applications(){
      const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);


  const navigate= useNavigate();

 
  const handleFileChange = (e) => setResume(e.target.files[0]);

  const { id } = useParams();
  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const token=localStorage.getItem('accessToken');
      const { data } = await apiClient.post(
        "http://localhost:8000/api/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
     navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
   

    const handleImgChange = (e) => {
      setFile(e.target.files[0]);
  };

}

  return (
    <section className="application container-fluid vh-100 bg-secondary d-flex align-items-center justify-content-center">
      <div className="container bg-light p-4" style={{ width: '400px' }}>
        <h3 className="text-center">Apply</h3>
        <form onSubmit={handleApplication}>
          <div className="row mb-3">
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="row mb-3">
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="row mb-3">
            <input
              type="number"
              id="phone"
              placeholder="Your Phone Number"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="row mb-3">
            <input
              type="text"
              id="address"
              placeholder="Your Address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              id="coverLetter"
              placeholder="Cover Letter..."
              className="form-control"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
          <div className="rowmb-3 fw-bold">
            <label htmlFor='resume'>Resume</label>
            <input
              type="file"
              id="resume"
              accept=".pdf, .jpg, .png"
              className="form-control"
              onChange={handleFileChange}
            />
            
      <input
        type="text"
        className="form-control"
        value={file ? file.name : 'No file uploaded'}
        readOnly
      />
          </div><br></br>
          <button type="submit" className="btn btn-info w-100 mb-2">Send Application</button>
        </form>
      </div>
    </section>
  );
};




export default Applications;