


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
  

  useEffect(() => {
    
    const fetchCourseCodes = async () => {
      try {
        const response = await axios.get(`${baseUrl}/searchqp?text=${searchText}`, {
       
        });
        setCourseCodes(response.data.uniqueCourseCodes);
      } catch (error) {
        console.error('Error fetching course codes:', error);
      }
    };

    fetchCourseCodes();

   
  }, [searchText]);

  const handleCodeClick = async (code) => {
    try {
      const response = await axios.get(`${baseUrl}/searchqp?text=${code}`);
      setImageData(response.data.imageData);
      setSelectedCode(code);
    } catch (error) {
      console.error('Error fetching images for course code:', error);
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


  return (
    <div className="searchqp-container">

  
    
      <h1>Search Question paper based on Subject Name, Code, or Faculty</h1>
      <div className="search-bar">
        <FaSearch />
        <input
          className="inpt"
          type="text"
          placeholder="Search "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    
      <h1>Available Question Papers</h1>
    
  
      <div className='coursecodes '>
     
      {courseCodes.map((code, index) => (

        <button 
          key={index}
          onClick={() => handleCodeClick(code)}
          className=  {selectedCode === code ? 'selected' : ''}
        >
          {code}
        </button>
       
      ))}

      </div>

      {noResults && <p>No results found for "{searchText}"</p>}
      {isLoading && <div className="loader">Loading, wait for a few seconds</div>}
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
