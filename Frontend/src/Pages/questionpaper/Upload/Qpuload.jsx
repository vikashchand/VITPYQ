import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // All pages can be reordered. Metadata remains associated with the first page after reordering.
  const handlePageDragStart = (event, index) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handlePageDragOver = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    event.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handlePageDrop = (event, targetIndex) => {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData('text/plain'));

    if (
      !Number.isInteger(sourceIndex) ||
      sourceIndex < 0 ||
      targetIndex < 0 ||
      sourceIndex === targetIndex
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setImages(prev => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePageDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const onDrop = (acceptedFiles) => {
    setImages(acceptedFiles);
    setButtonsVisible(true); // Show buttons when images are uploaded
  };






  const handleImageChange = async () => {
    setLoading(true);
  
    if (images.length === 0) {
      setLoading(false);
      return;
    }
  
    try {


      const image = images[0];
    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Crop the top half of the image
      canvas.width = img.width;
      canvas.height = img.height / 2;
      ctx.drawImage(img, 0, 0, img.width, img.height / 2, 0, 0, img.width, img.height / 2);

      const croppedImage = canvas.toDataURL('image/png');

      const { data: { text } } = await Tesseract.recognize(croppedImage, 'eng');

      //const { data: { text } } = await Tesseract.recognize(images[0], 'eng');
  

      //console.log(text);
      // Check if the first three characters match specific prefixes
      const prefixes = ['swe', 'eee', 'mat', 'bit', 'cse','fre','ger','jap','esp'];
      const potentialPrefixes = [];
      let allMatches = [];
  
      for (const prefix of prefixes) {
        if (text.toLowerCase().includes(prefix.toLowerCase())) {
          potentialPrefixes.push(prefix);
        }
      }
  
      //console.log("Potential Prefixes:", potentialPrefixes);
  
      if (potentialPrefixes.length > 0) {
        // Process each potential prefix
        potentialPrefixes.forEach(potentialPrefix => {
          // Extract words starting with the potential prefix, excluding 'answer'
          const wordsWithPrefix = text
            .split(/\s+/)
            .filter(word =>
              word.toLowerCase().startsWith(potentialPrefix.toLowerCase()) && word.toLowerCase() !== 'answer'
            );
  
         // console.log(`Words with ${potentialPrefix} Prefix:`, wordsWithPrefix);
  
          // Join the words back into a single string
          const filteredText = wordsWithPrefix.join(' ');
  
          // Extract the first 7 characters as the potential course code
          const regex = /\b[A-Za-z]{3}[A-Za-z\d]{4}\b/;
          const match = filteredText.match(regex);
  
          //console.log(`Regex Match for ${potentialPrefix}:`, match);
  
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


      //console.log("facultyname",facultyLine,"courseName",courseLine);




      setLoading(false);

    };
  } catch (error) {
    console.error('Error extracting text:', error);
    setTextResults(['Error extracting text']);
    setLoading(false);
  }
};










  


const takeback= async () =>{

  setImages([]);
      setTextResults([]);
      setButtonsVisible(false);
  
}

  

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
  
 


    const compressImage = async (image) => {
      const options = {
        maxSizeMB: 3, // Set the maximum size in megabytes
        maxWidthOrHeight: 1200, // Set the maximum width or height
      };
    
      // Check the size of the image
      if (image.size > options.maxSizeMB * 1024 * 1024) {
        try {
          // Compress the image if its size is greater than 4 MB
          return await imageCompression(image, options);
        } catch (error) {
          console.error('Error compressing image:', error);
          return image; // Return the original image if compression fails
        }
      } else {
        // If the image size is within the limit, use the original image
        return image;
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
      setButtonsVisible(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      
  
      // Display error toast
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };
  
  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: 'image/*',
  //   onDrop,
  // });





  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImages((prevImages) => [...prevImages, ...acceptedFiles]);
      setButtonsVisible(true);
    },
  });
  


  return (
    <main className="page-shell upload-page">
      <header className="upload-header">
        <div><span className="eyebrow">CONTRIBUTE TO THE VAULT</span><h1 className="page-heading">Preserve a paper.<br/><span className="colourchangetext">Help the next batch.</span></h1><p className="page-subtitle">Upload clear page images, arrange them in order, let OCR detect the metadata, then review everything before it enters the archive.</p></div>
        <div className="workflow"><span className="active">01 Upload</span><i/><span className={images.length?"active":""}>02 Arrange</span><i/><span className={textResults.length?"active":""}>03 Review</span><i/><span>04 Save</span></div>
      </header>
      <section className="upload-workspace">
        <div className="upload-guide glass"><div className="guide-title"><span className="feature-icon">✓</span><div><small>BEFORE YOU UPLOAD</small><h2>Make OCR's job easy.</h2></div></div><div className="guide-grid"><div><strong>01</strong><p>Use portrait, well-lit images with the complete page visible.</p></div><div><strong>02</strong><p>Drag any page into the correct reading order.</p></div><div><strong>03</strong><p>Compressed images are fine. Avoid extremely large files.</p></div></div></div>
        <div {...getRootProps()} className="dropzone premium-dropzone"><input {...getInputProps()}/><div className="drop-icon">↑</div><h2>Drop your question paper here</h2><p>or click to choose multiple images from your device</p><span>JPG · PNG · Clear scans recommended</span></div>
      </section>
      {loading&&<div className="ocr-progress glass"><span className="loader-ring"/><div><strong>Reading your first page…</strong><p>OCR is extracting course metadata. This can take a moment.</p></div></div>}
      {images.length>0&&<section className="upload-review">
        <div className="review-header"><div><span className="eyebrow">DOCUMENT REVIEW</span><h2>{images.length} page{images.length===1?"":"s"} ready</h2><p>Drag any page to reorder the paper. All pages can move freely; the paper metadata stays with the document.</p></div><div className="review-actions">{buttonsVisible&&<><button onClick={handleImageChange} disabled={loading}>Extract metadata</button><button onClick={saveChanges} disabled={loading}>Save to vault</button><button className="ghost-button" onClick={takeback} disabled={loading}>Discard</button></>}</div></div>
        <div className="document-list">
          {images.map((image,index) => (
            <article
              key={`${image.name}-${image.lastModified}-${index}`}
              className={`document-page ${index===0?"primary-page":""} ${draggedIndex===index?"is-dragging":""} ${dragOverIndex===index?"is-drag-over":""}`}
              draggable={true}
              onDragStart={(event) => handlePageDragStart(event, index)}
              onDragOver={(event) => handlePageDragOver(event, index)}
              onDrop={(event) => handlePageDrop(event, index)}
              onDragEnd={handlePageDragEnd}
            >
              <div className="page-number">{String(index+1).padStart(2,"0")}</div>
              <div className="drag-handle" aria-label={`Drag page ${index+1} to reorder`}>⠿</div>
              <img src={URL.createObjectURL(image)} alt={`Question paper page ${index+1}`}/>
              {index===0 && (
                <div className="metadata-panel">
                  <div className="metadata-title"><span>OCR METADATA</span><small>Attached to first page</small></div>
                  <label>Course code<input value={Array.isArray(textResults[0]) ? textResults[0].join(', ') : (textResults[0]||"")} onChange={e=>setTextResults(prev=>{const next=[...prev];next[0]=e.target.value.slice(0,80).toUpperCase();return next})} placeholder="e.g. CSE4001"/></label>
                  <label>Faculty name<input value={textResults[1]||""} onChange={e=>setTextResults(prev=>{const next=[...prev];next[1]=e.target.value;return next})} placeholder="Faculty name"/></label>
                  <label>Course name<input value={textResults[2]||""} onChange={e=>setTextResults(prev=>{const next=[...prev];next[2]=e.target.value;return next})} placeholder="Course / subject name"/></label>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>}
      {!images.length&&<div className="upload-empty"><span>Nothing uploaded yet</span><p>Your document preview and editable OCR fields will appear here.</p></div>}
      <ToastContainer/>
    </main>
  );
};
export default TextExtractionApp;
