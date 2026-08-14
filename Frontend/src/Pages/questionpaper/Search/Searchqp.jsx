


import React, { useEffect, useState } from 'react';
import { FaSearch, FaDownload, FaTimes,FaArrowRight } from 'react-icons/fa';
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseCodes();
  }, []);


  const handleCodeClick = async (code) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/searchqp?text=${code}`, {
        timeout: 1800000, // Set timeout in milliseconds (adjust as needed)
      });

      setImageData(response.data.imageData);
      setSelectedCode(code);
      setSuggestions([]); // Clear suggestions after selecting a code
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled due to timeout');
        // Handle the timeout gracefully, e.g., show a message to the user
      } else {
        console.error('Error fetching images for course code:', error);
        // Handle other errors, e.g., show an error message to the user
      }
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
      const response = await axios.get(`${baseUrl}/globalapi?mode=${mode}&text=${value}`, {
        timeout: 1800000, // Set timeout in milliseconds (adjust as needed)
      });

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
    <main className="page-shell qp-page">
      <header className="qp-header">
        <div>
          <span className="eyebrow">QUESTION BANK</span>
          <h1 className="page-heading">Find the paper. <span className="colourchangetext">Skip the digging.</span></h1>
          <p className="page-subtitle">Search the shared MIS archive by course code, subject or faculty. Open a paper, inspect every page, and download it when you're ready.</p>
        </div>
        <div className="qp-stat"><strong>{courseCodes.length || "—"}</strong><span>indexed course codes</span></div>
      </header>
      <section className="search-console glass">
        <div className="search-console-top"><div><small>SEARCH THE ARCHIVE</small><h2>What are you looking for?</h2></div><span className="search-status">● Archive online</span></div>
        <div className="search-controls">
          <select value={searchMode} onChange={e => { setSearchMode(e.target.value); setSuggestions([]) }} aria-label="Search type">
            <option value="courseCode">Course code</option><option value="courseName">Course name</option><option value="facultyName">Faculty name</option>
          </select>
          <div className="search-input-wrap"><FaSearch /><input value={searchText} onChange={handleSearchTextChange} placeholder={`Try ${searchMode === "courseCode" ? "CSE4001" : searchMode === "courseName" ? "Data Structures" : "faculty name"}...`} /><button className="search-clear" onClick={() => { setSearchText(""); setSuggestions([]) }} disabled={!searchText}><FaTimes /></button></div>
        </div>
        {searchText && suggestions.length > 0 && <div className="suggestion-panel">{suggestions.slice(0, 5).map((s, i) => <button className="suggestion-row" key={i} onClick={() => handleSuggestionClick(s)}><span>{s}</span><FaArrowRight /></button>)}</div>}
      </section>
      {!searchText && !selectedCode && <section className="quick-section"><div className="section-label"><span>QUICK ACCESS</span><p>Browse by course code</p></div><div className="code-cloud">{courseCodes.map((code, i) => <button className="code-chip" key={i} onClick={() => handleCodeClick(code)}>{code}</button>)}</div></section>}
      {isLoading && <div className="qp-loading"><span className="loader-ring" /><div><strong>Searching the vault…</strong><p>Matching your query against the indexed archive.</p></div></div>}
      {!isLoading && imageData.length === 0 && (searchText || selectedCode) && <div className="qp-empty glass"><div>⌕</div><h3>No papers found yet</h3><p>Try a different course code, subject name or faculty. You can also clear the search and browse the course index.</p><button onClick={handleBackButtonClick}>Browse the archive</button></div>}
      {imageData.length > 0 && <section className="results-section"><div className="results-head"><div><span className="eyebrow">RESULTS</span><h2>{selectedCode || searchText}</h2><p>{imageData.length} paper set{imageData.length === 1 ? "" : "s"} found</p></div><button className="ghost-button" onClick={handleBackButtonClick}>New search</button></div><div className="paper-grid">{imageData.map((result, qi) => <article className="paper-card" key={qi}><div className="paper-preview" onClick={() => openModal(qi, 0)}>{result.imageUrls?.[0] && <img src={result.imageUrls[0]} alt={`Question paper ${qi + 1}`} />}<span>Open preview</span></div><div className="paper-meta"><div><small>PAPER SET {String(qi + 1).padStart(2, "0")}</small><h3>{selectedCode || "Question paper"}</h3></div><button className="icon-button" onClick={() => handleDownload(result.imageUrls)} title="Download paper"><FaDownload /></button></div><p>{result.imageUrls?.length || 0} page{result.imageUrls?.length === 1 ? "" : "s"} · Click preview to read</p></article>)}</div></section>}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Question paper preview" className="qp-modal" overlayClassName="qp-overlay">
        <div className="modal-toolbar"><div><small>QUESTION PAPER PREVIEW</small><strong>{selectedCode || searchText}</strong></div><button onClick={closeModal}>×</button></div>
        {imageData.length > 0 && <><div className="modal-image-wrap"><img src={imageData[currentImageIndex.questionIndex]?.imageUrls?.[currentImageIndex.imageIndex]} alt="Question paper page" /></div><div className="modal-footer"><span>Page {currentImageIndex.imageIndex + 1} of {imageData[currentImageIndex.questionIndex]?.imageUrls?.length || 0}</span><div><button onClick={handlePrevImage}>Previous</button><button onClick={handleNextImage}>Next</button></div></div></>}
      </Modal>
    </main>
  );
};
export default SearchQp;
