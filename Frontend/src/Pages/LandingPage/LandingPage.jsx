import React,{useState, useEffect} from 'react';
import {  FaSearchengin, FaSearch,FaUpload, FaUser, FaRegNewspaper, FaWpforms, FaMapMarkedAlt } from 'react-icons/fa';
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
      <h1>Welcome to the VIT Previous Year Question and Faculty Review Portal</h1>
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
                
                <p>This automatically extracts the text from image hence ,user wont need to type subject name ,code faculty name just You need to be a good at taking snaps</p>
              
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
                <button >   <Link className='lin' to="/searchqp">Search </Link> </button>
              
                </div>
            </li>

            <li className="feature-card">
            <div className="feature-icon">
              <FaSearchengin />
            </div>
            <div className="feature-details">
              <h3>Extensive Search </h3>
             
             <p>If a good snap has been uploaded one can even serach question paper based on question asked</p>
              </div>
              
          </li>
           
          <li className="feature-card">
          <div className="feature-icon">
            <FaSearch />
          </div>
          <div className="feature-details">
            <h3>Faculty Review</h3>
            <p>Currently in development mode ,will deployed to production by christmas 🧑‍🎄</p>
            <p>Faculty serach module will only be active during ffcs </p>
            <button >   <Link className='lin' to="/faculty">Review </Link> </button>
              
            </div>
        </li>

        <li className="feature-card">
        <div className="feature-icon">
          <FaRegNewspaper />
        </div>
        <div className="feature-details">
          <h3>Total  Uploads </h3>
          
          
          <p>No of question papers: {totalEntries !== null ? totalEntries : 'Loading...'}</p>
          
          </div>
      </li>

      <li className="feature-card">
      <div className="feature-icon">
        <FaUser />
      </div>
      <div className="feature-details">
        <h3>Total Users </h3>
        
       <p> Total Visitors: {totalVisitors !== null ? totalVisitors : 'Loading...'} </p>
        </div>
    </li>
        
          

    
    <li className="feature-card">
    <div className="feature-icon">
      <FaWpforms />
    </div>
    <div className="feature-details">
      <h3>Contact Me </h3>
      <p> Fill the given Below form To give Your valuable Feedback ,queries or Collaborate on this project</p>
     
      <a href='https://forms.gle/DtanNBDASu7xEkcK7'> Form</a>
    
     </div>
      
  </li>
            
           
          </ul>
        </div>

       
      </div>
      <div className='dev'> Made by the Student of 4th Year (2020-2025) Of Integrated M.Tech in Software Engineering with Love 💖 (Anonymous)</div>
    </div>
  );
}

export default LandingPage;
