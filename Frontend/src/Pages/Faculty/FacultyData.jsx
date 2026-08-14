import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import facultyReview from "../../assets/FacultyReviews.pdf";
import baseUrl from "../../config";
import "./Faculty.css";

const FacultySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (searchTerm.trim() !== "") {
          const response = await axios.get(
            `${baseUrl}/faculties?search=${searchTerm}`
          );
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSelectFaculty = async (facultyId) => {
    try {
      const response = await axios.get(`${baseUrl}/faculties/${facultyId}`);
      const facultyData = response.data;
      setSelectedFaculty(facultyData);
      setLikeCount(facultyData.like);
      setDislikeCount(facultyData.dislike);
      setHasVoted(false);
      setSearchTerm(""); // Clear the search term when a faculty is selected
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };
  const clearSelectedFaculty = () => {
    setSelectedFaculty(null);
  };

  useEffect(() => {
    if (selectedFaculty && !hasVoted) {
      setLikeCount(selectedFaculty.like);
      setDislikeCount(selectedFaculty.dislike);
    }
  }, [selectedFaculty, hasVoted]);

  const handleLike = async () => {
    if (!hasVoted) {
      try {
        // Update the like count on the server
        await axios.put(`${baseUrl}/faculties/${selectedFaculty._id}/like`);
        // Update the like count locally
        setLikeCount(likeCount + 1);
        // Set local storage to remember the vote
        localStorage.setItem(`vote-${selectedFaculty._id}`, "like");
        setHasVoted(true);
      } catch (error) {
        console.error("Error liking faculty:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (!hasVoted) {
      try {
        // Update the dislike count on the server
        await axios.put(`${baseUrl}/faculties/${selectedFaculty._id}/dislike`);
        // Update the dislike count locally
        setDislikeCount(dislikeCount + 1);
        // Set local storage to remember the vote
        localStorage.setItem(`vote-${selectedFaculty._id}`, "dislike");
        setHasVoted(true);
      } catch (error) {
        console.error("Error disliking faculty:", error);
      }
    }
  };


  return (
    <main className="page-shell faculty-page">
      <header className="faculty-directory-head"><div><span className="eyebrow">FACULTY DIRECTORY</span><h1 className="page-heading">Choose with <span className="colourchangetext">context.</span></h1><p className="page-subtitle">Search faculty names to read student perspectives and see the community sentiment at a glance.</p></div><a className="download-button" href={facultyReview} download>Download review archive</a></header>
      <section className="faculty-search-box glass"><label>SEARCH FACULTY<input className="facultyname" type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Start typing a faculty name…"/></label>{suggestions.length>0&&<ul className="suggestions-list">{suggestions.map(f=><li key={f._id} onClick={()=>handleSelectFaculty(f._id)}><span>{f.name}</span><small>View profile →</small></li>)}</ul>}</section>
      {!selectedFaculty&&<div className="faculty-empty"><div>◎</div><h3>Search for a faculty member</h3><p>Results and reviews will appear here once you select a name.</p></div>}
      {selectedFaculty&&<section className="selected-faculty-details glass"><div className="faculty-profile-head"><div className="avatar">{selectedFaculty.name?.slice(0,1)}</div><div><span className="eyebrow">FACULTY PROFILE</span><h2>{selectedFaculty.name}</h2><p>{selectedFaculty.reviews?.length||0} student perspective{selectedFaculty.reviews?.length===1?"":"s"}</p></div><button className="clear-button" onClick={clearSelectedFaculty}>Close</button></div><div className="review-list">{selectedFaculty.reviews.map((review,index)=><article key={index}><span>“</span><p>{review.review}</p></article>)}</div><div className="vote-bar"><div><strong>Was this useful?</strong><small>Your vote helps future students.</small></div><div className="vote-buttons"><button disabled={hasVoted} onClick={handleLike}><FaThumbsUp/> {likeCount}</button><button disabled={hasVoted} onClick={handleDislike}><FaThumbsDown/> {dislikeCount}</button></div></div></section>}
    </main>
  );
};
export default FacultySearch;
