
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/profile.css';
import toast from "react-hot-toast";

const ProfileUpdate = () => {
    const userId = localStorage.getItem('userId');
    const [profilePicture, setProfilePicture] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [experiences, setExperiences] = useState([]);
    const [education, setEducation] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [resume, setResume] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    const fetchProfileInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/profile/${userId}`);
            const {
                username,
                Bio,
                profilePicture,
                age,
                address,
                phoneNumber,
                experiences,
                education,
                certifications,
                resume
            } = response.data.user;
            setUsername(username);
            setBio(Bio);
            setProfilePicture(profilePicture);
            setAge(age);
            setAddress(address);
            setPhoneNumber(phoneNumber);
            setExperiences(experiences);
            setEducation(education);
            setCertifications(certifications);
            setResume(resume);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleBioChange = (e) => setBio(e.target.value);
    const handleAgeChange = (e) => {
        const ageValue = parseInt(e.target.value);
        setAge(isNaN(ageValue) ? null : ageValue);
    };    const handleAddressChange = (e) => setAddress(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handleImgChange = (e) => setProfilePicture(e.target.files[0]);
    const handleResumeChange = (e) => setResume(e.target.files[0]);

    const handleExperienceChange = (index, field, value) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index][field] = value;
        setEducation(newEducation);
    };

    const handleCertificationChange = (index, field, value) => {
        const newCertifications = [...certifications];
        newCertifications[index][field] = value;
        setCertifications(newCertifications);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('accessToken');
            
            const formData = new FormData();
            formData.append("username", username);
            formData.append("Bio", bio);
            formData.append("age", age);
            formData.append("address", address);
            formData.append("phoneNumber", phoneNumber);
            if (profilePicture) formData.append("profilePicture", profilePicture);
            if (resume) formData.append("resume", resume);
    
            formData.append("experiences", JSON.stringify(experiences));
            
            formData.append("education", JSON.stringify(education));
            
            formData.append("certifications", JSON.stringify(certifications));
    
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            await axios.put(`http://localhost:8000/api/profile/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
    
            toast.success('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            toast.error('Error updating user profile:', error);
            toast.success('Failed to update profile. Please try again later.');
        }
    };
    
    

    const handleModifyClick = () => setEditMode(true);
    const handleCancelClick = () => setEditMode(false);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/logout');
            if (response.status === 200) {
                localStorage.removeItem('userId');
                localStorage.removeItem('accessToken');
                navigate('/');
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const renderProfileForm = () => (
        <div >
           <form className="profile-form container background" onSubmit={handleSubmit} style={{ width: '100%' }}>
    <div className="container border shadow rounded p-3 mb-3">

    <div className="form-group">
        <label htmlFor="name" className="mb-2">Name:</label>
        <input type="text" id="name" className="form-control input" value={username} onChange={handleUsernameChange} required />
        {validationErrors.name && <span className="error">{validationErrors.name}</span>}
    </div>
    <div className="form-group mb-2">
        <label htmlFor="bio" className="">Bio:</label>
        <textarea id="bio" className="form-control input" value={bio} onChange={handleBioChange} />
    </div>
    <div className="input-group ">
           <div className="input-group-prepend ">
              <span className="input-group-text rounded-0 " style={{height:'30px'}}>Profile Picture </span>
            </div>
            <input type="file" id="profilePicture" className="form-control-file" accept="image/*" onChange={handleImgChange} />
     </div>
    </div>
   

    <div className="container border shadow rounded p-3 mb-3">

    <div className="form-group">
        <label htmlFor="age" className="mb-2">Age:</label>
        <input type="number" id="age" className="form-control input" value={age} onChange={handleAgeChange} />
    </div>
    <div className="form-group">
        <label htmlFor="address" className="mb-2">Address:</label>
        <input type="text" id="address" className="form-control input" value={address} onChange={handleAddressChange} />
    </div>
    <div className="form-group mb-3">
        <label htmlFor="phoneNumber mb-2" className="">Phone Number:</label>
        <input type="text" id="phoneNumber" className="form-control input" value={phoneNumber} onChange={handlePhoneNumberChange} />
    </div>
   
    <div className="input-group">
        <div className="input-group-prepend">
            <span className="input-group-text rounded-0" style={{height:'30px'}}>resume </span>
        </div>
        <input type="file" id="resume" className="form-control-file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
    </div>
    </div>

    <div className="container border shadow rounded p-3 mb-3">
    <div className="form-group">
    <label className="mb-2 blue-color"><strong><h4>Experiences:</h4></strong></label>
        {experiences.map((exp, index) => (
            <div key={index} className="mb-3">
                <input type="text" className="form-control mb-1 input" placeholder="Title" value={exp.title} onChange={(e) => handleExperienceChange(index, 'title', e.target.value)} />
                <input type="text" className="form-control mb-1 input" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} />
                <input type="date" className="form-control mb-1 input" placeholder="From" value={exp.from} onChange={(e) => handleExperienceChange(index, 'from', e.target.value)} />
                <input type="date" className="form-control mb-1 input" placeholder="To" value={exp.to} onChange={(e) => handleExperienceChange(index, 'to', e.target.value)} />
                
            </div>
        ))}
        <button type="button" className="btn btnstyle2" onClick={() => setExperiences([...experiences, { title: '', company: '', from: '', to: '' }])}>Add Experience</button>
    </div>
</div>

<div className="container border shadow rounded p-3 mb-3">
    <div className="form-group">
    <label className="mb-2 blue-color"><strong><h4>Education:</h4></strong></label>
        {education.map((edu, index) => (
            <div key={index} className="mb-3">
                <input type="text" className="form-control mb-1 input" placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(index, 'school', e.target.value)} />
                <input type="text" className="form-control mb-1 input" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                <input type="date" className="form-control mb-1 input" placeholder="From" value={edu.from} onChange={(e) => handleEducationChange(index, 'from', e.target.value)} />
                <input type="date" className="form-control mb-1 input" placeholder="To" value={edu.to} onChange={(e) => handleEducationChange(index, 'to', e.target.value)} />
                
            </div>
        ))}
        <button type="button" className="btn btnstyle2" onClick={() => setEducation([...education, { school: '', degree: '', from: '', to: '' }])}>Add Education</button>
    </div>
    </div>

    <div className="container border shadow rounded p-3 mb-3">
    <div className="form-group">
    <label className="mb-2 blue-color"><strong><h4>Certifications:</h4></strong></label>
        {certifications.map((cert, index) => (
            <div key={index} className="mb-3">
                <input type="text" className="form-control mb-1 input" placeholder="Name" value={cert.name} onChange={(e) => handleCertificationChange(index, 'name', e.target.value)} />
                <input type="text" className="form-control mb-1 input" placeholder="Institution" value={cert.institution} onChange={(e) => handleCertificationChange(index, 'institution', e.target.value)} />
                <input type="date" className="form-control mb-1 input" placeholder="Date" value={cert.date} onChange={(e) => handleCertificationChange(index, 'date', e.target.value)} />
                
            </div>
        ))}
        <button type="button" className="btn btnstyle2" onClick={() => setCertifications([...certifications, { name: '', institution: '', date: '' }])}>Add Certification</button>
    </div>
    </div>
    <div className="form-group d-flex w-100 ">
        <button type="submit" className="btn btnstyle1 w-50 m-2">Submit</button>
        <button type="button" className="btn btn-secondary w-50 m-2" onClick={handleCancelClick}>Cancel</button>

    </div>
</form>

        </div>
    );

    
    const renderProfileView = () => (
        
            <div className="profile-view  container border" >
                <div className="text-center mb-4">
                    <h3 className="blue-color mt-2">{username}</h3>
                    <h6><i>{bio}</i>  </h6>
                </div>
                {age || address || phoneNumber ? (
           <div className="personal-infos m-3">
               
                <label className="mb-2 blue-color"><strong><h4>Personal Infos :</h4></strong></label>
                
                <div className="container border">
                    {age && (
                        <div className="row ">
                            <div className="col-md-6 form-group d-flex align-items-center">
                                <label className="me-2 mb-0"><strong>Age:</strong></label>
                                <p className="mb-0">{age}</p>
                            </div>
                        </div>
                    )}
                    {address && (
                        <div className="row ">
                            <div className="col-md-6 form-group d-flex align-items-center">
                                <label className="me-2 mb-0"><strong>Address:</strong></label>
                                <p className="mb-0">{address}</p>
                            </div>
                        </div>
                    )}
                    {phoneNumber && (
                        <div className="row mb-3">
                            <div className="col-md-6 form-group d-flex align-items-center">
                                <label className="me-2 mb-0"><strong>Phone Number:</strong></label>
                                <p className="mb-0">{phoneNumber}</p>
                            </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

    
                <div className="resume m-3">
                    
                        {resume.length>0 && (
                            
                            <div className="form-group container">
                                
                                <label className="mb-2"><strong>Resume :</strong></label>
                                <p><a href={`http://localhost:8000/uploads/${resume}`} target="_blank" rel="noopener noreferrer">Download CV</a></p>
                            </div>
                        ) }
                    </div>

                
                
                    <div className='experiences m-3'>
                   
                        {experiences.length > 0 && (
                            <div className="form-group">
                                <label className="mb-2 blue-color"><strong><h4>Experiences:</h4></strong></label>
                                {experiences.map((exp, index) => (
                                    <div key={index} className="container border mb-1">
                                        <p><strong>{exp.title} in {exp.company}</strong></p>
                                        <p>From: {new Date(exp.from).toLocaleDateString()}  To  {new Date(exp.to).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                {education.length > 0 && (
                    <div className="education m-3">
                       
                        <div className="form-group">
                            <label className="mb-2 blue-color"><strong><h4>Education:</h4></strong></label>
                            {education.map((edu, index) => (
                                <div key={index} className="container border mb-3">
                                    <p><strong>{edu.degree} in  {edu.school}</strong> </p>
                                    <p>From: {new Date(edu.from).toLocaleDateString()} To {new Date(edu.to).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                    {certifications.length > 0 && (
                    <div className="form-group m-3 ">
                       
                        <label className="mb-2 blue-color"><strong><h4>Certifications :</h4></strong></label>
                        {certifications.map((cert, index) => (
                            <div key={index} className="container border mb-3">
                                <p><strong>{cert.name} from  {cert.institution}</strong> </p>
                                <p> {new Date(cert.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex gap-2 p-3 w-100">
                    <button className="btn btnstyle1 w-100"  onClick={handleModifyClick}>Edit</button>
                </div>
            </div>
       
    );
    

    return (
        <>
            {editMode ? renderProfileForm() : renderProfileView()}
        </>
    );
};

export default ProfileUpdate;
