import React,{useState, useEffect} from 'react';
import {  FaSearchengin, FaSearch,FaUpload, FaUser, FaRegNewspaper,FaVideo,FaHandsHelping, FaMoneyCheckAlt, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GiTeacher } from "react-icons/gi";
import './LandingPage.css';

import boy from '../../assets/boy18.png'

import baseUrl from '../../config';
import AdSenseAd from '../AdSenseAd';
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
    
      <h1 className='colourchangetext'>Welcome to the MIS Previous Year Question and Faculty Review Portal</h1>
    
      <h2 >Exclusively For Mtech in Software Enginnering students </h2>

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
            <FaMoneyCheckAlt />
          </div>
            <div className="feature-details">
              <h3>Placements </h3>
      
              <p>Past year Placements</p>
              <p>List of companies that came last year and their packages</p>
                         
  <button >   <Link className='lin' to="https://docs.google.com/spreadsheets/d/1bCY-6fq7ek990C860bN1QADkXukd5PCEMat1eVcYAoM/edit?usp=sharing">Google sheets  </Link> </button>
                
              </div>
          </li>
           
           
          <li className="feature-card">
          <div className="feature-icon">
            <GiTeacher />
          </div>
          <div className="feature-details">
            <h3>Faculty Review</h3>
    
            <p>Faculty serach module will only be active during ffcs Phases </p>
            <button >   <Link className='lin' to="/facultydata">Review </Link> </button>
              
            </div>
        </li>

        <li className="feature-card">
        <div className="feature-icon">
          <FaHandsHelping />
        </div>
        <div className="feature-details">
          <h3>Seniors Advice</h3>
  
          <p>Tips for placements by Placed seniors</p>
          <button >   <Link className='lin' to="/placementBlogs">Review </Link> </button>
            
          </div>
      </li>

         
        <li className="feature-card">
        <div className="feature-icon">
        <FaVideo/>
        </div>
        <div className="feature-details">
       
          <h3>Demo</h3>
          <iframe className='video' src="https://www.youtube.com/embed/f41Y-V1nIlk?si=5AIHI2_Xrknep6Pv&amp;controls=0&amp;start=5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
      
      
      
     
  
     
    
     
      
    </div>


      </div>


  );
}

export default LandingPage;
