import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';
import imageCompression from 'browser-image-compression'; 
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Qpupload.css';
import baseUrl from '../../../config';
import stringSimilarity from 'string-similarity';
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






  const handleImageChange = async () => {
    setLoading(true);
  
    if (images.length === 0) {
      setLoading(false);
      return;
    }
  
    try {
      const { data: { text } } = await Tesseract.recognize(images[0], 'eng');
  

      console.log(text);
      // Check if the first three characters match specific prefixes
      const prefixes = ['swe', 'eee', 'mat', 'bit', 'cse','fre','ger','jap','esp'];
      const potentialPrefixes = [];
      let allMatches = [];
  
      for (const prefix of prefixes) {
        if (text.toLowerCase().includes(prefix.toLowerCase())) {
          potentialPrefixes.push(prefix);
        }
      }
  
      console.log("Potential Prefixes:", potentialPrefixes);
  
      if (potentialPrefixes.length > 0) {
        // Process each potential prefix
        potentialPrefixes.forEach(potentialPrefix => {
          // Extract words starting with the potential prefix, excluding 'answer'
          const wordsWithPrefix = text
            .split(/\s+/)
            .filter(word =>
              word.toLowerCase().startsWith(potentialPrefix.toLowerCase()) && word.toLowerCase() !== 'answer'
            );
  
          console.log(`Words with ${potentialPrefix} Prefix:`, wordsWithPrefix);
  
          // Join the words back into a single string
          const filteredText = wordsWithPrefix.join(' ');
  
          // Extract the first 7 characters as the potential course code
          const regex = /\b[A-Za-z]{3}[A-Za-z\d]{4}\b/;
          const match = filteredText.match(regex);
  
          console.log(`Regex Match for ${potentialPrefix}:`, match);
  
          if (match) {
            // Accumulate all matches
            allMatches = allMatches.concat(match);
          }
        });
  
        if (allMatches.length > 0) {
          // Set the results with all the matches
          setTextResults(allMatches);
        } else {
          // No matching pattern found
          setTextResults("error");
          toast.success("can't find code. edit manually");
        }
      } else {
        // No matching prefix found
        setTextResults("can't find code. edit manually");
        toast.error("can't find code. edit manually");
      }
 


  const facultyLineRegex = /.*\bFaculty\b[^:\n]*:\s*(.*)/i;
  const facultyMatch = text.match(facultyLineRegex);
  const facultyLine = facultyMatch ? facultyMatch[1].replace(/\b(?:Faculty|Name|Names|Facultys)\b/gi, '').trim() : '';


  const courseLineRegex = /.*\bCourse\b[^:\n]*:\s*(.*)/i;
  const courseMatch = text.match(courseLineRegex);
  const courseLine = courseMatch ? courseMatch[1].replace(/\b(?:Course|Subject|Code|Title|Courses|Name)\b/gi, '').trim() : '';




      // Update state to include extracted values for the first image
      setTextResults([allMatches,facultyLine, courseLine, ]);


      console.log("facultyname",facultyLine,"courseName",courseLine);







    } catch (error) {
      console.error('Error extracting text:', error);
      setTextResults(['Error extracting text']);
    } finally {
      setLoading(false);
    }
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
  
    // Check if text is provided for the first image
    if (!textResults[0]) {
      // Display a toast message asking the user to extract text
      toast.info('Please press the "Extract Text" button for the first image', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
  
    // Ensure that textResults[0] is an array
    const courseCodeArray = Array.isArray(textResults[0]) ? textResults[0] : [textResults[0]];
  
    // const imagesData = await Promise.all(images.map(async (image, index) => {
    //   const imageDataUrl = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       resolve(reader.result);
    //     };
    //     reader.readAsDataURL(image);
    //   });
  


    const compressImage = async (image) => {
      const options = {
        maxSizeMB: 2, // Set the maximum size in megabytes
        maxWidthOrHeight: 800, // Set the maximum width or height
      };
    
      try {
        return await imageCompression(image, options);
      } catch (error) {
        console.error('Error compressing image:', error);
        return image; // Return the original image if compression fails
      }
    };








      const imagesData = await Promise.all(images.map(async (image, index) => {
        // Compress the image before converting to base64
        const compressedImage = await compressImage(image);
    
        const imageDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(compressedImage);
        });








      return {
        image: imageDataUrl.split(',')[1], // Extract base64 portion of the data URL
        courseCode: courseCodeArray.join(', '), // Join array elements into a string
        facultyName: textResults[1],
        courseName: textResults[2],
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
      toast.error(error, {
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



      <div {...getRootProps()} className="dropzone inpdrop">
        <input {...getInputProps()} />
        <p>Drag ➡️ rearrange ➡️ extract ➡️ save </p>
      </div>

      {loading && <BeatLoader css={override} size={15} color={'black'} loading={loading} />}

      <DragDropContext onDragEnd={onDragEnd} >
    

    
      <Droppable droppableId={droppableId} >
        {(provided) => (
          
          <div {...provided.droppableProps} ref={provided.innerRef} className="image-list ">
          
         
{images.map((image, index) => (
  <Draggable key={index} draggableId={`image-${index}`} index={index}>
    {(provided) => (
      <div className='reorder' {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
        <div className="image-container">
          <p>{index+1}</p>
          <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
          {index === 0 && (
            <div className="text-container">

            

          
            <div className="text-contain">
            <label htmlFor="subjectCode">Subject Code:</label>
            <input
              className='in'
              value={textResults[index]}
              onChange={(e) =>
                setTextResults((prev) => {
                  const updatedResults = [...prev];
                  updatedResults[index] = e.target.value;
                  return updatedResults;
                })
              }
              placeholder="Enter text..."
            />
          </div>
          
          <div className="text-contain">
            <label htmlFor="facultyName">Faculty Name:</label>
            <input
              className='in'
              value={textResults[index + 1]}
              onChange={(e) =>
                setTextResults((prev) => {
                  const updatedResults = [...prev];
                  updatedResults[index + 1] = e.target.value;
                  return updatedResults;
                })
              }
              placeholder="Enter faculty name..."
              id="facultyName"
            />
          </div>
          
          <div className="text-contain">
            <label htmlFor="courseName">Course Name:</label>
            <input
              className='in'
              value={textResults[index + 2]}
              onChange={(e) =>
                setTextResults((prev) => {
                  const updatedResults = [...prev];
                  updatedResults[index + 2] = e.target.value;
                  return updatedResults;
                })
              }
              placeholder="Enter course name..."
              id="courseName"
            />
          </div>
          

              

             
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
                Extract 
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







// <div className="text-contain">

// <label htmlFor="subjectCode">Subject Code:</label>


// <input
// className='in'
// value={textResults[index]}
// onChange={(e) =>
// setTextResults((prev) => [...prev.slice(0, index), e.target.value, ...prev.slice(index + 1)])
// }
// placeholder="Enter text..."
// />
// </div>


// <div className="text-contain">
// <label htmlFor="facultyName">Faculty Name:</label>
// <input
// className='in'
// value={textResults[index + 1]}  // Adjust the index for faculty name
// onChange={(e) => setTextResults([...textResults.slice(0, index + 1), e.target.value, ...textResults.slice(index + 2)])}
// placeholder="Enter faculty name..."
// id="facultyName"
// />
// </div>

// <div className="text-contain">
// <label htmlFor="courseName">Course Name:</label>
// <input
// className='in'
// value={textResults[index + 2]}  // Adjust the index for course name
// onChange={(e) => setTextResults([...textResults.slice(0, index + 2), e.target.value, ...textResults.slice(index + 3)])}
// placeholder="Enter course name..."
// id="courseName"
// />
// </div>