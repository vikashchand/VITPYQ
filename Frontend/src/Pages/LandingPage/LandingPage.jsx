import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUpload,
  FaUser,
  FaRegNewspaper,
  FaMoneyCheckAlt,
  FaHandsHelping,
  FaVideo,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiTeacher } from "react-icons/gi";
import "./LandingPage.css";
import interview from "../../assets/2024placement.pdf";
import baseUrl from "../../config";

const LandingPage = () => {
  const [totalEntries, setTotalEntries] = useState(null);
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalqp`);
        const data = await response.json();
        setTotalEntries(data.totalEntries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalVisitors = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalvisitor`);
        const data = await response.json();
        setTotalVisitors(data.totalVisitors);
      } catch (error) {
        console.error("Error fetching total visitors:", error);
      }
    };

    fetchTotalVisitors();
  }, []);

  useEffect(() => {
    // Check popup counter in local storage
    const popupCounter = localStorage.getItem("popupCounter") || 0;

    if (popupCounter < 8) {
      setShowPopup(true);
      localStorage.setItem("popupCounter", parseInt(popupCounter) + 1);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="landing-page">
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close" onClick={handleClosePopup}>
              Close
            </button>
            <h5>New Interview added! Check the placement page</h5>
            <h5>Get some tips from your batchmates.</h5>
            <a>
              The placement interview experiences of the Batch of 2024 have been
            </a>
            <a>compressed into a PDF to optimize MongoDB storage capacity.</a>
            <a href={interview} download>
              Download Interview PDF
            </a>
          
          </div>
        </div>
      )}

      <h1 className="colourchangetext">
        Welcome to the MIS Previous Year Question and Faculty Review Portal
      </h1>
      <h2>Exclusively For MTech in Software Engineering students</h2>

      <div className="feature-container">
        <div className="feature-description">
          <ul className="feature-cards">
            <li className="feature-card">
              <div className="feature-icon">
                <FaUpload />
              </div>
              <div className="feature-details">
                <h3>Upload</h3>
                <p>
                  Automatically extracts text from images, so you don't need to
                  type subject names, codes, or faculty names. Just take good
                  snaps!
                </p>
                <button>
                  <Link className="lin" to="/qpupload">
                    Upload
                  </Link>
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <div className="feature-details">
                <h3>Search</h3>
                <p>
                  Search subjects based on subject code, subject name, or
                  faculty name.
                </p>
                <button>
                  <Link className="lin" to="/searchqps">
                    Search
                  </Link>
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaMoneyCheckAlt />
              </div>
              <div className="feature-details">
                <h3>Placements</h3>
                <p>Past year placements and company packages.</p>
                <button>
                  <a href={interview} download>
                    Download Sheet
                  </a>
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <GiTeacher />
              </div>
              <div className="feature-details">
                <h3>Faculty Review</h3>
                <p>
                  Faculty search module will only be active during FFCS phases.
                </p>
                <button>
                  <Link className="lin" to="/facultydata">
                    Review
                  </Link>
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaHandsHelping />
              </div>
              <div className="feature-details">
                <h3>Seniors Advice</h3>
                <p>Tips for placements by placed seniors.</p>
                <button>
                  <Link className="lin" to="/placementBlogs">
                    Review
                  </Link>
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaVideo />
              </div>
              <div className="feature-details">
                <h3>Demo</h3>
                <iframe
                  className="video"
                  src="https://www.youtube.com/embed/f41Y-V1nIlk?controls=0&start=5"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="dev">
          
        </div>

        <h3>
          Total Uploads <FaRegNewspaper />{" "}
          {totalEntries !== null ? totalEntries : "Loading..."}
        </h3>
        <h3>
          Total Users <FaUser />{" "}
          {totalVisitors !== null ? totalVisitors : "Loading..."}
        </h3>
      </div>
    </div>
  );
};

export default LandingPage;
