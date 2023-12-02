import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import './Qpupload.css';

const TextExtractionApp = () => {
  const [images, setImages] = useState([]);
  const [textResults, setTextResults] = useState([]);

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  
    const extractedText = await Promise.all(
      selectedImages.map((image) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            Tesseract.recognize(reader.result, 'eng')
              .then(({ data: { text } }) => {
                resolve(text.trim());
              })
              .catch((error) => {
                console.error('Error during text extraction:', error);
                resolve('Error extracting text');
              });
          };
          reader.readAsDataURL(image);
        });
      })
    );
  
    setTextResults(extractedText);
  };
  

// ...

const saveChanges = async (index) => {
  const formData = new FormData();
  formData.append('text', textResults[index]);

  // Convert image to binary data
  const imageFile = images[index];
  const imageBinary = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const binary = reader.result.split(',')[1];
      resolve(binary);
    };
    reader.readAsDataURL(imageFile);
  });
  try {
    const response = await axios.post('http://localhost:5000/saveqp', { image: imageBinary, text: textResults[index] }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Server Response:', response.data);
  } catch (error) {
    console.error('Error saving changes:', error);
  }
  
};

// ...







  return (
    <div className="text-extraction-app">
      <input className='uploadbtn' type="file" accept="image/*" multiple onChange={handleImageChange} />

      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
          <div className="text-container">
            <textarea
              value={textResults[index] || ''}
              onChange={(e) => setTextResults((prev) => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])}
            />
            <button onClick={() => saveChanges(index)}>Save Changes</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextExtractionApp;
