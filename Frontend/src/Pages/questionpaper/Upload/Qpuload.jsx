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
  const saveChanges = async () => {
    const imagesData = await Promise.all(images.map(async (image, index) => {
      const imageDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(image);
      });
  
      return {
        image: imageDataUrl.split(',')[1], // Extract base64 portion of the data URL
        text: textResults[index],
      };
    }));
  
    try {
      const response = await axios.post('http://localhost:5000/saveqp', imagesData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Server Response:', response.data);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
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
          </div>
        </div>
      ))}

      <button onClick={saveChanges}>Save Changes</button>
    </div>
  );
};

export default TextExtractionApp;
