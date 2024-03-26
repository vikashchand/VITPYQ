import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlacementCard from './PlacementCard';
import baseUrl from '../../config';
import './PlacementsPage.css'; // Import CSS file for styles

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await axios.get(`${baseUrl}/placements`);
        setPlacements(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching placements:', error);
      }
    };

    fetchPlacements();
  }, []);

  // Render loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="placements-page">
      <h1 className="page-title">Placements Insights</h1>
      <div className="placement-cards-container">
        {placements.map((placement) => (
          <PlacementCard key={placement._id} placement={placement} />
        ))}
      </div>



      <div className='dev'>
      
      <h6>Made by Vikash Chand (2020-2025) with Love 💖</h6>
      <br></br>
      <br></br>
      Special Thanks to <a href="https://www.linkedin.com/in/soundarya-lahari-kasturi/">Soundarya Lahari K</a> and <a href="https://www.linkedin.com/in/ishubham99/">Shubham Choudhary</a>
        
    
  
     
    
     
      
    </div>

    </div>
  );
};

export default PlacementsPage;
