import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../contexts/index';
import axios from 'axios';
import toast from 'react-hot-toast';

function JobPost() {

    const { server } = useDataContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [industry, setIndustry] = useState('');
    const [subIndustry, setSubIndustry] = useState('');
    const [salaryFrom, setSalaryFrom] = useState('');
    const [salaryTo, setSalaryTo] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const industries = {
        Technology: ['Software Development', 'Cybersecurity', 'Artificial Intelligence', 'Data Science', 'Cloud Computing'],
        Healthcare: ['Hospitals & Clinics', 'Pharmaceuticals', 'Medical Devices', 'Biotechnology', 'Health Insurance'],
        Finance: ['Banking', 'Investment Management', 'Insurance', 'Financial Technology (FinTech)', 'Real Estate'],
        Manufacturing: ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Aerospace'],
        Retail: ['E-commerce', 'Fashion & Apparel', 'Grocery Stores', 'Luxury Goods', 'Home Improvement']
    };

    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedSubIndustry, setSelectedSubIndustry] = useState('');

    const handleIndustryChange = (event) => {
        setSelectedIndustry(event.target.value);
        setSelectedSubIndustry('');
    };

    const handleSubIndustryChange = (event) => {
        setSelectedSubIndustry(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log("title : " + title);
        // console.log("description: " + description);
        // console.log("industry : " + selectedIndustry);
        // console.log("subIndustry : " + selectedSubIndustry);
        // console.log("location : " + location);
        // console.log("salaryFrom : " + salaryFrom);
        // console.log("salaryTo : " + salaryTo);

        // try {

        //     await axios.post('http://localhost:8000/api/job/post', {
        //         title: title,
        //         description: description,
        //         industry: selectedIndustry,
        //         subIndustry: selectedSubIndustry,
        //         location: location,
        //         salaryFrom: salaryFrom,
        //         salaryTo: salaryTo,
        //         jobPostedOn: currentDate,
        //         postedBy: userId,
        //     }, {
        //         headers: {
        //             'Authorization': `Bearer ${token}`,
        //             "Content-Type": "application/json"
        //         }
        //     });

        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        const currentDate = new Date();

        await server.emit('jobPost', {
            title: title,
            description: description,
            industry: selectedIndustry,
            subIndustry: selectedSubIndustry,
            location: location,
            salaryFrom: salaryFrom,
            salaryTo: salaryTo,
            jobPostedOn: currentDate,
            postedBy: userId,
        });

        toast.success('Job posted successfully!');
        navigate('/')
        // } catch (error) {
        //     console.error('Error posting job:', error);
        //     toast.error('Failed to post job. Please try again later.');
        // }
    };

    return (
        <div className="vh-100 w-100 bg-secondary d-flex justify-content-center align-items-center">
            <form className="profile-form container m-4 " onSubmit={handleSubmit} style={{ width: '45%' }}>
                <div className="head form-group text-center">
                    <h3 className="mb-4 text-secondary">Job Post</h3>
                </div>
                <div className="form-group">
                    <label htmlFor="title" className="mb-2">Job Title :</label>
                    <input type="text" id="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="mb-2">Description :</label>
                    <textarea id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="location" className="mb-2">Location :</label>
                    <input type="text" id="location" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="industry" className="mb-2">Industry : </label>

                    <select id="industry" className="form-control mb-2" value={selectedIndustry} onChange={handleIndustryChange} required>
                        <option value="" disabled>Select Industry</option>
                        {Object.keys(industries).map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>

                    {selectedIndustry && (
                        <select id="subIndustry" className="form-control" value={selectedSubIndustry} onChange={handleSubIndustryChange} required>
                            <option value="" disabled>Select Sub Industry</option>
                            {industries[selectedIndustry].map((subIndustry) => (
                                <option key={subIndustry} value={subIndustry}>{subIndustry}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="salaryFrom" className="mb-2">Salary From :</label>
                    <input type="number" id="salaryFrom" className="form-control" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="salaryTo" className="mb-2">Salary To :</label>
                    <input type="number" id="salaryTo" className="form-control" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} />
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-info w-100 mb-2">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default JobPost;
