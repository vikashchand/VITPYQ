
import React,{useState,useEffect} from "react";
import {FaSearch,FaUpload,FaUser,FaRegNewspaper,FaMoneyCheckAlt,FaHandsHelping,FaVideo ,FaArrowRight} from "react-icons/fa";
import {Link} from "react-router-dom"; import {GiTeacher} from "react-icons/gi";
import "./LandingPage.css"; import interview from "../../assets/2024placement.pdf"; import baseUrl from "../../config";
const LandingPage=()=>{
 const [totalEntries,setTotalEntries]=useState(null),[totalVisitors,setTotalVisitors]=useState(null),[showPopup,setShowPopup]=useState(false);
 useEffect(()=>{fetch(`${baseUrl}/totalqp`).then(r=>r.json()).then(d=>setTotalEntries(d.totalEntries)).catch(console.error);},[]);
 useEffect(()=>{fetch(`${baseUrl}/totalvisitor`).then(r=>r.json()).then(d=>setTotalVisitors(d.totalVisitors)).catch(console.error);},[]);
 useEffect(()=>{const c=Number(localStorage.getItem("popupCounter")||0);if(c<8){setShowPopup(true);localStorage.setItem("popupCounter",c+1)}},[]);
 const features=[
  {icon:<FaSearch/>,tag:"QUESTION BANK",title:"Find the exact paper.",text:"Search by course code, subject or faculty and jump straight to the papers you need.",to:"/searchqps",cta:"Open question bank"},
  {icon:<FaUpload/>,tag:"CONTRIBUTE",title:"Turn your paper into history.",text:"Upload clear scans and let OCR capture the course details. Review once, then save it for the next batch.",to:"/qpupload",cta:"Add a paper"},
  {icon:<GiTeacher/>,tag:"FACULTY VOICES",title:"Choose with context.",text:"Explore student feedback before FFCS decisions, with reviews gathered in one focused place.",to:"/facultydata",cta:"Explore faculty"},
  {icon:<FaMoneyCheckAlt/>,tag:"CAREER HUB",title:"Learn from the batch ahead.",text:"Read placement stories, interview experiences and practical lessons from students who already made the leap.",to:"/placementBlogs",cta:"Explore careers"},
  {icon:<FaHandsHelping/>,tag:"RESOURCES",title:"Keep the useful stuff close.",text:"A curated shelf of academic tools, notes and exam resources shared by the MIS community.",to:"/Accessories",cta:"Browse resources"}
 ];
 return <main className="landing-page">
 {showPopup&&<div className="popup"><div className="popup-content glass"><button className="popup-close" onClick={()=>setShowPopup(false)}>×</button><span className="eyebrow">NEW IN THE ARCHIVE</span><h3>2024 interview experiences are live.</h3><p>See how seniors approached placements, what they were asked and what they wish they had known earlier.</p><a className="primary-link" href={interview} download>Download the interview pack <FaArrowRight/></a></div></div>}
 <section className="landing-hero page-shell">
  <div className="hero-copy"><span className="eyebrow">20MIS KNOWLEDGE VAULT ✦</span><h1 className="colourchangetext">Your semester,<br/>remembered.</h1><p className="hero-lead">A student-built archive for the things you need at exactly the right time — past papers, faculty perspectives, senior stories and useful resources.</p>
   <div className="hero-actions"><Link className="hero-primary" to="/searchqps">Find a question paper <FaArrowRight/></Link><Link className="hero-secondary" to="/qpupload">Contribute a paper</Link></div>
   <div className="trust-line"><span>Built for MIS students</span><i/> <span>Searchable archive</span><i/> <span>OCR-assisted uploads</span></div>
  </div>
  <div className="hero-visual"><div className="vault-card"><div className="vault-top"><span>THE VAULT</span><span className="live-dot">● LIVE</span></div><div className="vault-number">{totalEntries??"—"}</div><p>question papers indexed</p><div className="vault-bars"><b/><b/><b/><b/><b/></div><div className="vault-mini"><span>Students reached</span><strong>{totalVisitors??"—"}</strong></div></div></div>
 </section>
 <section className="feature-section page-shell"><div className="section-head"><div><span className="eyebrow">ONE PLACE. LESS FRICTION.</span><h2>Everything students actually need.</h2></div><p>Designed around the moments that matter — finding, contributing, choosing and preparing.</p></div>
 <div className="feature-grid">{features.map((f,i)=><article className={`feature-card pro-card f-${i}`} key={f.title}><div className="feature-icon">{f.icon}</div><small>{f.tag}</small><h3>{f.title}</h3><p>{f.text}</p><Link to={f.to}>{f.cta}<FaArrowRight/></Link></article>)}<article className="feature-card video-card"><div className="video-heading"><span className="feature-icon"><FaVideo/></span><div><small>QUICK TOUR</small><h3>See the archive in action.</h3></div></div><iframe className="video" src="https://www.youtube.com/embed/f41Y-V1nIlk?controls=0&start=5" title="20MIS archive walkthrough" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></article></div></section>
 <section className="closing-strip page-shell"><div><span className="eyebrow">THE IDEA</span><h2>Make the next batch's life a little easier.</h2></div><p>Every paper you upload, review you leave and story you share becomes useful context for someone who comes after you.</p><Link to="/qpupload" className="hero-primary">Contribute to the vault <FaArrowRight/></Link></section>
 </main>
};
export default LandingPage;
