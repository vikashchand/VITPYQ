import React from 'react';
import { Link } from 'react-router-dom';
import './PlacementCard.css'; // Import CSS file for styles

const PlacementCard = ({ placement }) => {
  return (
    <div className="placement-card">
      <Link to={`/placement/${placement._id}`} className="placement-link">
      <div className="placement-image-container">
      <img src={placement.image} alt={placement.companyName} className="placement-image" />
    </div>
        <div className="placement-details">
          <h3 className="placement-company"> {placement.companyName}</h3>
          <h4 className="placement-username">{placement.username} got  {placement.summary}</h4>
        
        
        </div>
      </Link>
    </div>
  );
};

export default PlacementCard;
