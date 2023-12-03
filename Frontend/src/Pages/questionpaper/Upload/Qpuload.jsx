import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Qpupload.css';
import baseUrl from '../../../config';

const override = css`
  display: block;
  margin: 0 auto;
`;

const TextExtractionApp = () => {
  const [images, setImages] = useState([]);
  const [textResults, setTextResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false); // New state for button visibility

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
    setButtonsVisible(true); // Show buttons when images are uploaded
  };


  const droppableId = `droppable-${new Date().getTime()}`;

  // const handleImageChange = async () => {
  //   setLoading(true);
  
  //   if (images.length === 0) {
  //     setLoading(false);
  //     return;
  //   }
  
  //   const extractedText = await Tesseract.recognize(images[0], 'eng')
  //     .then(({ data: { text } }) => text.trim())
  //     .catch(() => 'Error extracting text');
  
  //   setTextResults([extractedText]);
  //   setLoading(false);
  // };


  const handleImageChange = async () => {
    setLoading(true);
  
    if (images.length === 0) {
      setLoading(false);
      return;
    }
  
    const extractedText = await Tesseract.recognize(images[0], 'eng')
      .then(({ data: { text } }) => text.trim())
      .catch(() => 'Error extracting text');
  
    // Extract the first 300 words from the text
    const first300Words = extractedText.split(/\s+/).slice(0, 100).join(' ');
  
    setTextResults([first300Words]);
    setLoading(false);
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
      const response = await axios.post(`${baseUrl}/saveqp`, imagesData, {
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

  const onDragEnd = (result) => {
    if (!result.destination) return;
  
    const reorderedImages = Array.from(images);
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedItem);
  
    const reorderedTextResults = Array.from(textResults);
    const [reorderedText] = reorderedTextResults.splice(result.source.index, 1);
    reorderedTextResults.splice(result.destination.index, 0, reorderedText);
  
    setImages(reorderedImages);
    setTextResults(reorderedTextResults);
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  return (
    <div className="text-extraction-app">
      <h1>"Masterful Document Handling: Rearrange, Extract, Edit, Save – Simply."</h1>
      <div className='instructions'>
      
      <ul>
      <h3>Steps</h3>
     
    
      <li>1.For Multiple images select images, rearrange images by dragging them.</li>
    
     <li>2.After rearranging images, click 'Extract Text'.</li>
     <li>3.Keep focus on first image only coz that will be used for extracting text</li>
     <li>Only first 100 words will be extracted from first image to maintain efficiency and storage</li>
   
     <li>4.Review and edit the first text box if needed.</li>
     <li>5.Click 'Save' to preserve changes to images.</li>
     <li></li>
      
      
      </ul>
      
      
      </div>



      <div {...getRootProps()} className="dropzone inp">
        <input {...getInputProps()} />
        <p>Drag some images here, or click to select Images</p>
      </div>

      {loading && <BeatLoader css={override} size={15} color={'black'} loading={loading} />}

      <DragDropContext onDragEnd={onDragEnd}>
    

    
      <Droppable droppableId={droppableId}>
        {(provided) => (
          
          <div {...provided.droppableProps} ref={provided.innerRef} className="image-list ">
          
         
          {images.map((image, index) => (
            
              <Draggable key={index} draggableId={`image-${index}`} index={index}>
           
                {(provided) => (

                  
                
                    <div className='reorder' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    
                    <div className="image-container">
                      <p>{index+1}</p>
                        <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                        {textResults[index] && (
                          <div className="text-container">
                            <textarea
                              value={textResults[index]}
                              onChange={(e) =>
                                setTextResults((prev) => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])
                              }
                              placeholder="Enter text..."
                            />
                          </div>
                        )}
                      </div>
                  
</div>
                    
                  )}
                  </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
    
          <div className="button-container">
          {buttonsVisible && ( // Conditionally render the buttons based on visibility state
            <>
              <button onClick={handleImageChange} disabled={loading || images.length === 0}>
                Extract Text of first image
              </button>
  
              <button onClick={saveChanges} disabled={loading || images.length === 0}>
                Save Changes
              </button>
            </>
          )}
        </div>
        
      

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default TextExtractionApp;
