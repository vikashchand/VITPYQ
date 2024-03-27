import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams ,Link} from 'react-router-dom';
import baseUrl from '../../config';
import './PlacementDetails.css'; // Import CSS file for styles
import {marked} from 'marked'

const PlacementDetails = () => {
  const { id } = useParams();
  const [placement, setPlacement] = useState(null);

  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        const response = await axios.get(`${baseUrl}/placements/${id}`);
        setPlacement(response.data);
      } catch (error) {
        console.error('Error fetching placement details:', error);
      }
    };

    fetchPlacement();
  }, [id]);

  if (!placement) {
    return <div className="loading">Loading...</div>;
  }

  // Function to convert HTML to plain text
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="placement-details">
      <h2 className="company-name">{placement.companyName}</h2>
      <div className="pimage-container">
        <img src={placement.image} alt={placement.companyName} className="placement-image" />
      </div>
      <p className="summary">{placement.summary}</p>
      
      <div className='description' dangerouslySetInnerHTML={{ __html: marked(placement.description) }}></div>

    <Link to={`/placementBlogs`} className="placement-link">  Back</Link>
    </div>
  );
};

export default PlacementDetails;
