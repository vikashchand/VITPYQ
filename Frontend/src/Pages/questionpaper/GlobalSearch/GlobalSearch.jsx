import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../../config';

const MainComponent = () => {
  const [query, setQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/suggestions?query=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (query) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/data?facultyName=${selectedFaculty}`);
      setImageData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSuggestionClick = (faculty) => {
    setSelectedFaculty(faculty);
    setQuery(faculty); // Update input field with the selected faculty
    fetchData(); // Fetch data when a suggestion is clicked
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by facultyafter name"
      />
      <ul>
        {suggestions.map((faculty) => (
          <li key={faculty} onClick={() => handleSuggestionClick(faculty)}>
            {faculty}
          </li>
        ))}
      </ul>
      <button onClick={fetchData}>Search</button>
      {imageData.map((item) => (
        <div key={item.key}>
          {item.imageUrls.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} />
          ))}
          {/* Include other fields if needed, e.g., courseCode, facultyName, courseName */}
        </div>
      ))}
    </div>
  );
};

export default MainComponent;
