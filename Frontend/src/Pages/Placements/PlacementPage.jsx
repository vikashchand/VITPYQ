import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlacementCard from './PlacementCard';
import baseUrl from '../../config';
import './PlacementsPage.css';




const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allPlacementsLoaded, setAllPlacementsLoaded] = useState(false);

  useEffect(() => {



    const fetchPlacements = async () => {
      try {
        const response = await axios.get(`${baseUrl}/placements?page=${page}&pageSize=5`);
        const newPlacements = response.data;
        if (newPlacements.length === 0) {
          setAllPlacementsLoaded(true);
        } else {
          setPlacements(prevPlacements => [ ...newPlacements]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching placements:', error);
      }
    };

    fetchPlacements();
  }, [page]);

  const loadMorePlacements = async () => {
    if (!allPlacementsLoaded) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="placements-page">
      <h1 className="page-title">Placements Insights</h1>
      <div className="placement-cards-container">
        {placements.map((placement, index) => (
          <PlacementCard key={`placement_${index}`} placement={placement} />
        ))}
      </div>
      {loading && <div className="lds-facebook"> Loading<div></div><div></div><div></div></div>}


      {!loading && !allPlacementsLoaded && (
        <button onClick={loadMorePlacements}>Next</button>
      )}
      {allPlacementsLoaded && <h2>No more data available</h2>}
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
