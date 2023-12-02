import React from 'react';
import {  FaSearchengin, FaSearch,FaUpload, FaChartLine, FaDatabase, FaUserShield, FaMapMarkedAlt } from 'react-icons/fa';

import './LandingPage.css';


const LandingPage = () => {
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
                
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <div className="feature-details">
                <h3>Search feature</h3>
                <p>Search subject based on Subject code and Subject Name or Faculty Name </p>
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
           

          
            
           
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
