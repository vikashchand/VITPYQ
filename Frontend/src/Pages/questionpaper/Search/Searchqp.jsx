// SearchQp.jsx

import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal';

import baseUrl from '../../../config';
import './Searchqp.css';

const SearchQp = () => {
  const [imageData, setImageData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchImages = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${baseUrl}/searchqp?text=${searchText}`, {
          cancelToken: cancelTokenSource.token,
        });

        // Check if there are search results
        if (response.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setImageData(response.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          // Request was canceled, ignore
        } else {
          console.error('Error fetching images:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call to only trigger after a short delay in user input
    const debounceTimeout = setTimeout(() => {
      fetchImages();
    }, 500); // Adjust the delay (in milliseconds) as needed

    return () => {
      clearTimeout(debounceTimeout); // Clear the timeout on cleanup
      cancelTokenSource.cancel('Request canceled by cleanup');
    };
  }, [searchText]);

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

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
      const truncatedText =
        lastSpaceIndex !== -1 ? text.substring(0, lastSpaceIndex) + '...' : text.substring(0, maxLength) + '...';
      return truncatedText;
    }
  }

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

      {noResults && <p>No results found for "{searchText}"</p>}

      {isLoading && <div className="loader">Loading wait for few secs</div>}

      

      <div className="card-container">
    
        {imageData.map((result, index) => (
          <div key={index} className="card">
          <h3>Click on the image to view it</h3>
            {result.imageUrls.map((imageUrl, imgIndex) => (
              <img
                key={imgIndex}
                src={imageUrl}
                alt={`Image ${index}`}
                onClick={() => openModal(imageUrl)}
              />
            ))}
            <div className="card-actions">
              <FaDownload onClick={() => handleDownload(result.imageUrls)} />
            </div>
            <p>{truncateText(result.text, 300)}</p>
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
          <img src={selectedImage} alt="Preview" />
          <FaTimes className="close-icon" onClick={closeModal} />
        </div>
      </Modal>
    </div>
  );
};

export default SearchQp;
