import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

import baseUrl from '../../config';
import './Faculty.css';

const FacultySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (searchTerm.trim() !== '') {
          const response = await axios.get(`${baseUrl}/faculties?search=${searchTerm}`);
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSelectFaculty = async (facultyId) => {
    try {
      const response = await axios.get(`${baseUrl}/faculties/${facultyId}`);
      const facultyData = response.data;
      setSelectedFaculty(facultyData);
      setSearchTerm(''); // Clear the search term when a faculty is selected
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    }
  };
  const clearSelectedFaculty = () => {
    setSelectedFaculty(null);
  };

  return (
    <div className="faculty-search-container">

      <h2>Search by Name</h2>
      <h2>Give Rating for the feedback provided on teachers</h2>
      <input className='facultyname'
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for faculty"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((faculty) => (
            <li key={faculty._id} onClick={() => handleSelectFaculty(faculty._id)}>
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
            <ol >
              {selectedFaculty.reviews.map((review, index) => (
                <li  key={index}>{review.review}</li>
              ))}
            </ol>
          </div>
          <button className="clear-button" onClick={clearSelectedFaculty}>
          close
        </button>
        </div>
      )}
    </div>
  );
};

export default FacultySearch;
