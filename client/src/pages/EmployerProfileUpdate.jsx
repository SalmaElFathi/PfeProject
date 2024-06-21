import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import '../components/profile.css';
import '../components/Dashboard.css';

const EmployerProfileUpdate = () => {
    const userId = localStorage.getItem('userId');
    const [profilePicture, setProfilePicture] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [entreprise, setEntreprise] = useState('');
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
                entreprise,
            } = response.data.user;
            setUsername(username);
            setBio(Bio);
            setProfilePicture(profilePicture);
            setAge(age);
            setAddress(address);
            setPhoneNumber(phoneNumber);
            setEntreprise(entreprise);
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
    };
    const handleAddressChange = (e) => setAddress(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handleEntrepriseChange = (e) => setEntreprise(e.target.value);
    const handleImgChange = (e) => setProfilePicture(e.target.files[0]);

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
            formData.append("entreprise", entreprise);
            if (profilePicture) formData.append("profilePicture", profilePicture);

            await axios.put(`http://localhost:8000/api/profile/${userId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            toast.error('Failed to update profile. Please try again later.');
        }
    };

    const handleModifyClick = () => setEditMode(true);
    const handleCancelClick = () => setEditMode(false);

    const renderProfileForm = () => (
        <div>
            <form className="profile-form container background" onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div className="container border shadow rounded p-3 mb-3">
                    <div className="form-group">
                        <label htmlFor="name" className="mb-2">Name:</label>
                        <input type="text" id="name" className="form-control " value={username} onChange={handleUsernameChange} required style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                        {validationErrors.name && <span className="error">{validationErrors.name}</span>}
                    </div>
                    <label htmlFor="age" className="mb-2">Bio:</label>
                    <div className="form-group mb-3">
                        <textarea id="bio" className="form-control " value={bio} onChange={handleBioChange} style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                    </div>
                    <div className="input-group d-flex align-items-center">
                    <div className="input-group-prepend ">
                        <span className="input-group-text rounded-0 " style={{height:'30px'}}>Profile Picture </span>
                      </div>
                      <div className="custom-file">
                    <input type="file" id="profilePicture" className="form-control-file" accept="image/*" onChange={handleImgChange} />
                    </div>
                </div>
                </div>

                <div className="container shadow rounded mb-3 p-3">
                    <div className="form-group">
                        <label htmlFor="age" className="mb-2">Age:</label>
                        <input type="number" id="age" className="form-control " value={age} onChange={handleAgeChange} style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address" className="mb-2">Address:</label>
                        <input type="text" id="address" className="form-control " value={address} onChange={handleAddressChange} style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="mb-2">Phone Number:</label>
                        <input type="text" id="phoneNumber" className="form-control " value={phoneNumber} onChange={handlePhoneNumberChange} style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                    </div>
                </div>

                
                <div className="container border mb-2 p-3 rounded shadow ">
                <label htmlFor="phoneNumber" className="">company: </label>

                    <div className="form-group">
                        <input type="text" id="entreprise" className="form-control" value={entreprise} onChange={handleEntrepriseChange} style={{ backgroundColor: '#f2f2f7', color: 'black', border: 'none' }} />
                    </div>
                </div>

                

                <div className="d-flex">
                    <button type="submit" className="btn btnstyle1 w-50 m-2 rounded" >Submit</button>
                    <button type="button" className="btn btn-secondary w-50 m-2" onClick={handleCancelClick}>Cancel</button>
                </div>
            </form>
        </div>
    );

    const renderProfileView = () => (
        <div className="container p-3 rounded">
            <div className="profile-view   ">
                <div className=" text-center border p-3 mb-2 ">
                    <h3 style={{ color: 'rgb(39, 30, 163)' }}>{username}</h3>
                    <h6 className="text-secondary"><i>{bio}</i></h6>
                </div>
                {(age || address || phoneNumber || entreprise) && (
                    <div className="personal-infos ">
                        <label className="mb-2" style={{ color: 'rgb(39, 30, 163)' }}><strong><h4>Personal Infos :</h4></strong></label>
                        <div className=" mb-2 border p-2 ">
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
                                    <div className="col-md-6 form-group align-items-center">
                                        <p className=" "><strong>Address:</strong>{address}</p>
                                    </div>
                                </div>
                            )}
                            {phoneNumber && (
                                <div className="row mb-2">
                                    <div className="col-md-6 form-group d-flex align-items-center">
                                        <label className="me-2 mb-0"><strong>Phone Number:</strong></label>
                                        <p className="mb-0">{phoneNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <label className="mb-2" style={{ color: 'rgb(39, 30, 163)' }}><strong><h4>Company</h4></strong></label>
                        <div className="container border  rounded">
                            {entreprise && (
                                <div className="row mb-3">
                                    <div className="col-md-6 form-group d-flex align-items-center">
                                        <label className="me-2 mb-0 p-2"><strong>Company :</strong></label>
                                        <p className="mb-0">{entreprise}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary w-100" onClick={handleModifyClick} style={{ backgroundColor: 'rgb(39, 30, 163)', color: 'white' }}>Edit</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {editMode ? renderProfileForm() : renderProfileView()}
        </>
    );
};

export default EmployerProfileUpdate;
