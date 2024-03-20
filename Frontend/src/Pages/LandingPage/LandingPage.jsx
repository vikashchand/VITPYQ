import React,{useState, useEffect} from 'react';
import {  FaSearchengin, FaSearch,FaUpload, FaUser, FaRegNewspaper, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LandingPage.css';

import baseUrl from '../../config';
const LandingPage = () => {

  const [totalEntries, setTotalEntries] = useState(null);

  const [totalVisitors, setTotalVisitors] = useState(null);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalqp`);
        const data = await response.json();

        // Assuming the response structure is { totalEntries: number }
        setTotalEntries(data.totalEntries);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchTotalVisitors = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalvisitor`); // Assuming this is the endpoint that provides totalVisitors
        const data = await response.json();

        // Assuming the response structure is { totalVisitors: number }
        setTotalVisitors(data.totalVisitors);
      } catch (error) {
        console.error('Error fetching total visitors:', error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchTotalVisitors();
  }, []);



  return (
    <div className="landing-page">
    
      <h1>Welcome to the MIS Previous Year Question and Faculty Review Portal</h1>
      <p>Exclusively For Mtech in Software Enginnering students </p>

      <div className="feature-container">
        <div className="feature-description">
        
          <ul className="feature-cards">
            <li className="feature-card">
              <div className="feature-icon">
                <FaUpload />
              </div>
              <div className="feature-details">
                <h3> Upload</h3>
                
                <p>automatically extracts the text from image hence ,user wont need to type subject name ,code faculty name, just You need to be a good at taking snaps</p>
              
                <button >   <Link className='lin' to="/qpupload">Upload </Link> </button>
              
            
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <div className="feature-details">
                <h3>Search </h3>
                <p>Search subject based on Subject code and Subject Name or Faculty Name </p>
                <button >   <Link className='lin' to="/searchqps">Search </Link> </button>
              
                </div>
            </li>

           
           
          <li className="feature-card">
          <div className="feature-icon">
            <FaSearch />
          </div>
          <div className="feature-details">
            <h3>Faculty Review</h3>
    
            <p>Faculty serach module will only be active during ffcs Phases </p>
            <button >   <Link className='lin' to="/facultydata">Review </Link> </button>
              
            </div>
        </li>

        

      
          

            
           
          </ul>
        </div>

       
      </div>
      
      
      <div >
      <h3>Total  Uploads <FaRegNewspaper/> {totalEntries !== null ? totalEntries : 'Loading...'}</h3>
        <h3>Total Users <FaUser/> {totalVisitors !== null ? totalVisitors : 'Loading...'}  </h3>
    


  </div>



  <div className='dev'>
      
      <h6>Made by VIKASH CHAND (2020-2025) with Love 💖  
      
      

    
<br></br>
      Contact Me on <a href="https://www.linkedin.com/in/piyushtsx/" >
      <FaLinkedinIn/>
      </a>  </h6>
      
     
  
     
    
     
      
    </div>
    
      </div>
  );
}

export default LandingPage;
