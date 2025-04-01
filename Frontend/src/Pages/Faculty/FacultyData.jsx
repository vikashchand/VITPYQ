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
    <div className="faculty-search-container">
      <h2>Search by Name</h2>
      <div className="download-container">
      
        <a href={facultyReview} download className="download-button">
          Directly Download Faculty Review PDF
        </a>
      </div>
      <h3>Give Rating for the feedback provided on teachers</h3>
      <input
        className="facultyname"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for faculty"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((faculty) => (
            <li
              key={faculty._id}
              onClick={() => handleSelectFaculty(faculty._id)}
            >
              {faculty.name}
            </li>
          ))}
        </ul>
      )}

      {selectedFaculty && (
        <div className="selected-faculty-details">
          <h2>{selectedFaculty.name}</h2>
          <div>
            <h3>Reviews:</h3>
            <ol>
              {selectedFaculty.reviews.map((review, index) => (
                <li key={index}>{review.review}</li>
              ))}
            </ol>
          </div>

          <div className="like-dislike-container">
            <div className="like" onClick={handleLike}>
              <FaThumbsUp /> {likeCount}
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="dislike" onClick={handleDislike}>
              <FaThumbsDown /> {dislikeCount}
            </div>
          </div>

          <button className="clear-button" onClick={clearSelectedFaculty}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultySearch;
