import React, { useState, useEffect } from "react";
import {
  FaSearchengin,
  FaSearch,
  FaUpload,
  FaUser,
  FaRegNewspaper,
  FaVideo,
  FaHandsHelping,
  FaMoneyCheckAlt,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { GiTeacher } from "react-icons/gi";
import "./LandingPage.css";
import pdf from "../../assets/mis.xlsx";
import boy from "../../assets/boy18.png";

import baseUrl from "../../config";
import AdSenseAd from "../AdSenseAd";

const LandingPage = () => {
  const [totalEntries, setTotalEntries] = useState(null);
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalqp`);
        const data = await response.json();

        // Assuming the response structure is { totalEntries: number }
        setTotalEntries(data.totalEntries);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalVisitors = async () => {
      try {
        const response = await fetch(`${baseUrl}/totalvisitor`); // Assuming this is the endpoint that provides totalVisitors
        const data = await response.json();

        // Assuming the response structure is { totalVisitors: number }
        setTotalVisitors(data.totalVisitors);
      } catch (error) {
        console.error("Error fetching total visitors:", error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchTotalVisitors();
  }, []);

  useEffect(() => {
    const popupShown = localStorage.getItem("popupShown");
    if (!popupShown) {
      setShowPopup(true);
      localStorage.setItem("popupShown", "true");
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
            <h5>New Interview added check the placement page</h5>
            <h5>Get some tips from Your batchmates.</h5>
            <a>To submit your interview experience msg me on linkedin</a>
          </div>
        </div>
      )}
      <h1 className="colourchangetext">
        Welcome to the MIS Previous Year Question and Faculty Review Portal
      </h1>

      <h2>Exclusively For Mtech in Software Enginnering students </h2>

      <div className="feature-container">
        <div className="feature-description">
          <ul className="feature-cards">
            <li className="feature-card">
              <div className="feature-icon">
                <FaUpload />
              </div>
              <div className="feature-details">
                <h3> Upload</h3>

                <p>
                  automatically extracts the text from image hence ,user wont
                  need to type subject name ,code faculty name, just You need to
                  be a good at taking snaps
                </p>

                <button>
                  {" "}
                  <Link className="lin" to="/qpupload">
                    Upload{" "}
                  </Link>{" "}
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <div className="feature-details">
                <h3>Search </h3>
                <p>
                  Search subject based on Subject code and Subject Name or
                  Faculty Name{" "}
                </p>
                <button>
                  {" "}
                  <Link className="lin" to="/searchqps">
                    Search{" "}
                  </Link>{" "}
                </button>
              </div>
            </li>
            <li className="feature-card">
              <div className="feature-icon">
                <FaMoneyCheckAlt />
              </div>
              <div className="feature-details">
                <h3>Placements </h3>

                <p>Past year Placements</p>
                <p>List of companies that came last year and their packages</p>

                <button>
                  {" "}
                  <a href={pdf} download>
                    {" "}
                    download sheet
                  </a>{" "}
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
                  Faculty serach module will only be active during ffcs Phases{" "}
                </p>
                <button>
                  {" "}
                  <Link className="lin" to="/facultydata">
                    Review{" "}
                  </Link>{" "}
                </button>
              </div>
            </li>

            <li className="feature-card">
              <div className="feature-icon">
                <FaHandsHelping />
              </div>
              <div className="feature-details">
                <h3>Seniors Advice</h3>

                <p>Tips for placements by Placed seniors</p>
                <button>
                  {" "}
                  <Link className="lin" to="/placementBlogs">
                    Review{" "}
                  </Link>{" "}
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
                  src="https://www.youtube.com/embed/f41Y-V1nIlk?si=5AIHI2_Xrknep6Pv&amp;controls=0&amp;start=5"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="dev">
          <p>
            Developed by{" "}
            <a
              href="https://vikashchand.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="developer-link"
            >
              Vikash Chand
            </a>
          </p>
        </div>

        <h3>
          Total Uploads <FaRegNewspaper />{" "}
          {totalEntries !== null ? totalEntries : "Loading..."}
        </h3>
        <h3>
          Total Users <FaUser />{" "}
          {totalVisitors !== null ? totalVisitors : "Loading..."}{" "}
        </h3>
      </div>

      <div className="dev"></div>
    </div>
  );
};

export default LandingPage;
