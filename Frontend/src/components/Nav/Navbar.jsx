import React, { useState } from "react";
import "./navbar.css";
import {
 
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);

  const handleNavLinkClick = () => {
    // Close the navbar when a link is clicked
    setShowMediaIcons(false);
  };




  return (
    <>
      <nav className="main-nav">
        {/* 1st logo part  */}
        <div className="logo">
        
          <NavLink to="/" >  <h2>
          MIS_Archives
         
         </h2></NavLink>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink to="/" onClick={handleNavLinkClick}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/searchqps" onClick={handleNavLinkClick}>Search</NavLink>
            </li>
            <li>
              <NavLink to="/qpupload" onClick={handleNavLinkClick}>Upload</NavLink>
            </li>
            <li>
              <NavLink to="/facultydata" onClick={handleNavLinkClick}>Faculty Review</NavLink>
            </li>

           

          <li>
          <NavLink to="/placementBlogs" onClick={handleNavLinkClick}>Placements</NavLink>
        </li>
        <li>
        <NavLink to="/Accessories" onClick={handleNavLinkClick}>Accessories</NavLink>
      </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          
          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu  className="ham"/>
            </a>
          </div>
        </div>
      </nav>

      {/* hero section  */}
      {/* <section className="hero-section">
        <p>Welcome to </p>
        <h1>Thapa Technical</h1>
      </section> */}
    </>
  );
};

export default Navbar;