


import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';

import baseUrl from '../../../config';
import './Searchqp.css';

const SearchQp = () => {
  const [courseCodes, setCourseCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchMode, setSearchMode] = useState('courseCode');
const [suggestions, setSuggestions] = useState([]);


const shouldDisplayCourseCodeButtons = searchText === '';


  

  useEffect(() => {
    
    const fetchCourseCodes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/uniqueCourseCodes`);
        setCourseCodes(response.data.uniqueCourseCodes);
      } catch (error) {
        console.error('Error fetching course codes:', error);
      } finally{
        setIsLoading(false); 
      }
    };
  
    fetchCourseCodes();
  }, []);

  // const handleCodeClick = async (code) => {
  //   try {
  //     setIsLoading(true); // Set loading to true when making the request
  //     const response = await axios.get(`${baseUrl}/searchqp?text=${code}`);
  //     setImageData(response.data.imageData);
  //     setSelectedCode(code);
  //   } catch (error) {
  //     console.error('Error fetching images for course code:', error);
  //   } finally {
  //     setIsLoading(false); // Set loading to false when the request is completed
  //   }
  // };





  const handleCodeClick = async (code) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/searchqp?text=${code}`);
      setImageData(response.data.imageData);
      setSelectedCode(code);
      setSuggestions([]); // Clear suggestions after selecting a code
    } catch (error) {
      console.error('Error fetching images for course code:', error);
    } finally {
      setIsLoading(false);
    }
  };





  

  const handleDownload = (imageUrls) => {
    imageUrls.forEach((imageUrl, index) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `downloaded_image_${index}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // const openModal = (index) => {
  //   setIsModalOpen(true);
  //   setCurrentImageIndex(index);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (questionIndex, imageIndex) => {
    setIsModalOpen(true);
    setCurrentImageIndex({ questionIndex, imageIndex });
  };

  const handleNextImage = () => {
    const totalImages = imageData[currentImageIndex.questionIndex]?.imageUrls.length || 0;
    setCurrentImageIndex((prevIndex) => {
      const newIndex = {
        questionIndex: prevIndex.questionIndex,
        imageIndex: (prevIndex.imageIndex + 1) % totalImages,
      };
      return newIndex;
    });
  };

  const handlePrevImage = () => {
    const totalImages = imageData[currentImageIndex.questionIndex]?.imageUrls.length || 0;
    setCurrentImageIndex((prevIndex) => {
      const newIndex = {
        questionIndex: prevIndex.questionIndex,
        imageIndex: (prevIndex.imageIndex - 1 + totalImages) % totalImages,
      };
      return newIndex;
    });
  };


  const handleSearchTextChange = (e) => {
    if (e.target.value === '') {
      setSuggestions([]);
     
       // Clear suggestions when the search text is empty
    }
    setSearchText(e.target.value);
    // Call a function to fetch suggestions based on the current search mode and text
    fetchSuggestions(searchMode, e.target.value);
  };
  
  
  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    // Fetch data based on the selected suggestion
    fetchData(searchMode, suggestion);
    // Clear suggestions
    setSuggestions([]);
  };
  
  
  const fetchSuggestions = async (mode, text) => {
    try {
      const response = await axios.get(`${baseUrl}/globalapi/suggestions?mode=${mode}&text=${text}`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };
  
  const fetchData = async (mode, value) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/globalapi?mode=${mode}&text=${value}`);
      setImageData(response.data.imageData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  
 
  const handleBackButtonClick = () => {
    setImageData([]);
    setSearchText('');
    setSuggestions([]); // Clear suggestions
    setSelectedCode(null);
  };


  return (
    <div className="searchqp-container">

    <h1>Search Question paper based on Subject Name, Code, or Faculty</h1>
<div  className='search-bar'>
    <select className='opti' value={searchMode} onChange={(e) => setSearchMode(e.target.value)}>
      <option value="facultyName">Faculty Name</option>
      <option value="courseName">Course Name</option>
      <option value="courseCode">Course Code</option>
    </select>

    <input
      type="text"
      placeholder={`Search by ${searchMode === 'facultyName' ? 'Faculty' : (searchMode === 'courseName' ? 'Course' : 'Code')}`}
      value={searchText}
      onChange={handleSearchTextChange}
    />
    </div>
    <div className="suggestions-list">
   
  {searchText !== '' && suggestions.slice(0, 3).map((suggestion, index) => (
  
   
    <div className='suggestions-listli' key={index} onClick={() => handleSuggestionClick(suggestion)}>
      {suggestion}
    
    </div>
  ))}
</div>


    <h1>Available Question Papers</h1>

    {isLoading && <div className="lds-facebook"> Loading<div></div><div></div><div></div></div>}

    {shouldDisplayCourseCodeButtons && (
      <div className='coursecodess'>
        {courseCodes.map((code, index) => (
          <button
            key={index}
            onClick={() => handleCodeClick(code)}
            className={selectedCode === code ? 'selected' : ''}
          >
            {code}
          </button>
        ))}
      </div>
    )}
     
   
      <div className="card-container">

     
      {imageData.map((result, questionIndex) => (
        <div key={questionIndex} className="card">
          <h3>Click on the image to view it</h3>
          {result.imageUrls && result.imageUrls.map((imageUrl, imageIndex) => (
            <img
              key={imageIndex}
              src={imageUrl}
              alt={`Image ${questionIndex + 1}-${imageIndex + 1}`}
              onClick={() => openModal(questionIndex, imageIndex)}
            />
            
          ))}
          <div className="card-actions">
            <FaDownload onClick={() => handleDownload(result.imageUrls)} />
          </div>
          {/* If you want to display other information related to the image, add it here */}
        </div>
      ))}


      {imageData.length > 0 && (
        <button className="back-button" onClick={handleBackButtonClick}>
          Close
        </button>
      )}
    </div>
    

    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Image Preview"
      className="modal"
      overlayClassName="overlay"
    >

      <div className="modal-content">
       
        {imageData.length > 0 && (
          <>

            {imageData[currentImageIndex.questionIndex]?.imageUrls && (
              <img
                src={imageData[currentImageIndex.questionIndex].imageUrls[currentImageIndex.imageIndex]}
                alt={`Image ${currentImageIndex.questionIndex + 1}-${currentImageIndex.imageIndex + 1}`}
              />
            )}
            <div className="modal-actions">
              {imageData[currentImageIndex.questionIndex]?.imageUrls && (
                <p>{currentImageIndex.imageIndex + 1} of {imageData[currentImageIndex.questionIndex].imageUrls.length}</p>
              )}
              {imageData[currentImageIndex.questionIndex]?.imageUrls && (
                <div className='modelbt'>
                 
                  <button onClick={handleNextImage}>Next</button>
                  
    <button className="close-icon" onClick={closeModal} > close </button>
                
</div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  </div>
);
};

export default SearchQp;
