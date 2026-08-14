
import React from "react"; import {Link} from "react-router-dom"; import "./PlacementCard.css";
const PlacementCard=({placement})=><Link to={`/placement/${placement._id}`} className="placement-card"><div className="placement-image-container"><img src={placement.image} alt={placement.companyName} className="placement-image"/><span>Read story →</span></div><div className="placement-details"><small>PLACEMENT STORY</small><h3 className="placement-company">{placement.companyName}</h3><div className="placement-author">{placement.username}</div><p>{placement.summary}</p></div></Link>;
export default PlacementCard;
