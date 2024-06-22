import React, { useState } from "react";
import NavBar from '../components/navBar';
import PopularCategories from '../components/popularCategories'
import '../components/Dashboard.css'
import LatestJobs from '../components/LatestJobs';
import Search from '../components/SearchBar';
import {Link} from 'react-router-dom';
const backgroundImg = 'https://i.pinimg.com/originals/53/fc/34/53fc34ee19077f82db4bfa36d4ff53c3.jpg';


export default function Home() {
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [loading, setLoading] = useState(true);
 
  
  const handleSearch = (jobs) => {
    setSearchedJobs(jobs);
    setSearchPerformed(true);

  };

  /*if (loading) {
    return <div>Loading...</div>;
  }*/


  

 
 return (
    <div className="bg-light">
      <div className="backgrnd  "
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',height:'380px'
          }}>
        <NavBar />
        <Search onSearch={handleSearch} />

          </div>
          { searchPerformed &&( <div className=" p-5" style={{backgroundColor:'white'}}>
       {searchedJobs.length === 0 ?(<div className="text-center"> no jobs found </div>):(
          <div>
            <h2 className=" blue-color mx-5"> Search Results</h2>
            <div className="row">
              {searchedJobs.map(job => (
                <div className="col-md-3 col-sm-4 mb-2 " key={job._id}>
                  <div className="card shadow align-items-center content-type p-2">
                    <strong>{job.title}</strong>
                    <p>{job.description}</p>
                    <Link to={`/job/${job._id}`} className="btn btnstyle2 mb-2">Job Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        )}
        </div>)}
     
        <div className="mt-5 ">
          <LatestJobs/>
        </div>
        <div  className="comp1 mb-2 back p-5">
            <h1 className="text-secondary text-center">your dream job just a click away </h1>
            <div className='d-flex'>
            <div>
            <h2 className="text-primary">Discover a career opportunity that aligns with your aspirations and abilities.</h2><br></br>
            <h5 className="text-secondary" >Welcome to our innovative job search platform that connects top talent with companies seeking 
              exceptional profiles. Whether you are an experienced professional or a recent graduate, our
               powerful search engine empowers you to quickly find opportunities that align with your unique 
               skills, experience, and career aspirations. </h5>
            </div>
          
          <img  src="https://janejacksoncoach.com/wp-content/uploads/2015/01/JJC-JOB-SEARCH-ONLINE-PIC.jpg"/>

          </div> 
        </div><br></br>

        <div>
              <h1 className="text-center"style={{color:'rgb(39, 30, 163)'}}>Popular Categories</h1>
            
          <PopularCategories/>
        </div>

    </div>
    
  );

  
}