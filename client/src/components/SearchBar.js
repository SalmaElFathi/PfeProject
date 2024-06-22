import React, { useState } from 'react';
import apiClient from '../config/apiClient'
import './SearchBar.css';
 const Search = ({onSearch}) => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    salary: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.get(`/api/jobs/search?title=${searchParams.title}&salary=${searchParams.salary}&location=${searchParams.location}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      console.log(data); 
      onSearch(data);
    } catch (error) {
      console.error('Error:', error);
     
    }
  };
    return (
        <div className="">
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={handleSubmit}>
                    <div className="input-group" id="adv-search">
                        <input type="text" className="form-control" placeholder="Search for a job" name="title" value={searchParams.title} onChange={handleChange}/>
                        <div className="input-group-btn">
                            <div className="btn-group" role="group">
                                <div className="dropdown dropdown-lg">
                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style={{backgroundColor:'white'}}>
                                        <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" role="menu">
                                        
                                            
                                            <div className="form-group">
                                                <label htmlFor="contain">Salary</label>
                                                <input className="form-control" type="text"  name="salary" value={searchParams.salary} onChange={handleChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="contain">Location</label>
                                                <input className="form-control" type="text" name="location" value={searchParams.location} onChange={handleChange}/>
                                            </div>
                                            <button type="submit" className="btn btnstyle2">
                                                <span className="bi bi-search" aria-hidden="true"></span>
                                            </button>
                                       
                                    </div>
                                </div>
                                <button type="submit" className="btn btnstyle2">
                                    <span className="bi bi-search" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>


</div>
          )}
      
export default Search ;