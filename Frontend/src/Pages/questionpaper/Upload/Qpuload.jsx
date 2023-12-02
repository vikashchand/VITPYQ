import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    if (images.length === 0) {
      // Display a toast message if no image is chosen
      toast.error('Please choose at least one image to save changes', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

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

      // Display success toast
      toast.success('Changes saved successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // Auto close the toast after 2 seconds
      });

      // Reset the form
      setImages([]);
      setTextResults([]);
    } catch (error) {
      console.error('Error saving changes:', error);

      // Display error toast
      toast.error('Error saving changes', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="text-extraction-app">
      <p>Select the images, wait for text extraction, edit the text content, and save the changes to upload.</p>
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

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default TextExtractionApp;
