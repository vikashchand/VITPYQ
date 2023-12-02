// SearchQp.jsx

import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import Modal from 'react-modal'; // Import the modal library
import './Searchqp.css'; // Import the CSS file

const SearchQp = () => {
  const [imageData, setImageData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch images on component mount
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/searchqp?text=${searchText}`);
        setImageData(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [searchText]);

  const handleDownload = (imageUrl) => {
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'downloaded_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      // Find the index of the last space within the first `maxLength` characters
      const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  
      // Truncate the text and add ellipsis
      const truncatedText = lastSpaceIndex !== -1 ? text.substring(0, lastSpaceIndex) + '...' : text.substring(0, maxLength) + '...';
  
      return truncatedText;
    }
  }
  
  return (
    <div className="searchqp-container">

    <h1> Search Question paper based on Subject Name,Code or Faculty</h1>
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search "
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <h3>Click on image to view it</h3>

      <div className="card-container">
        {imageData.map((result, index) => (
          <div key={index} className="card">
            <img src={result.imageUrl} alt={`Image ${index}`} onClick={() => openModal(result.imageUrl)} />
            <div className="card-actions">
              <FaDownload onClick={() => handleDownload(result.imageUrl)} />
            </div>
            <p>{truncateText(result.text, 500)}</p>
          </div>
        ))}
      </div>

      {/* Modal for image preview */}
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
