
import React,{useState} from "react";
import "./navbar.css";
import {GiHamburgerMenu} from "react-icons/gi";
import {FaMoon,FaSun} from "react-icons/fa";
import {NavLink} from "react-router-dom";
const Navbar=({theme,onToggleTheme})=>{
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 return <nav className="main-nav">
  <div className="logo"><NavLink to="/" onClick={close}><h2><span className="brand-mark">20</span>MIS<span className="brand-dot">.</span>Archive</h2></NavLink></div>
  <div className={open?"menu-link mobile-menu-link":"menu-link"}><ul>
   <li><NavLink to="/" onClick={close}>Home</NavLink></li>
   <li><NavLink to="/searchqps" onClick={close}>Question Bank</NavLink></li>
   <li><NavLink to="/qpupload" onClick={close}>Contribute</NavLink></li>
   <li><NavLink to="/facultydata" onClick={close}>Faculty Voices</NavLink></li>
   <li><NavLink to="/placementBlogs" onClick={close}>Career Hub</NavLink></li>
   <li><NavLink to="/Accessories" onClick={close}>Resources</NavLink></li>
  </ul></div>
  <div className="nav-actions"><button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme"><span>{theme==="light"?<FaMoon/>:<FaSun/>}</span><span className="theme-toggle-label">{theme==="light"?"Night":"Day"}</span></button></div>
  <div className="social-media"><div className="hamburger-menu"><a href="#menu" onClick={e=>{e.preventDefault();setOpen(!open)}}><GiHamburgerMenu className="ham"/></a></div></div>
 </nav>
};
export default Navbar;
