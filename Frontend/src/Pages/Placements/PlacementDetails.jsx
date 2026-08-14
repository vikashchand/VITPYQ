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


  if (!placement) return <main className="page-shell"><div className="qp-loading"><span className="loader-ring"/><strong>Opening story…</strong></div></main>;
  return <main className="page-shell story-page"><Link className="story-back" to="/placementBlogs">← Back to Career Hub</Link><header className="story-header"><span className="eyebrow">PLACEMENT STORY</span><h1>{placement.companyName}</h1><p>{placement.summary}</p><div className="story-meta"><span>Shared by <strong>{placement.username}</strong></span><span>Real student experience</span></div></header><div className="story-hero"><img src={placement.image} alt={placement.companyName}/></div><article className="story-body" dangerouslySetInnerHTML={{__html:marked(placement.description)}}/><Link className="story-end" to="/placementBlogs">Explore more career stories →</Link></main>;
};
export default PlacementDetails;
