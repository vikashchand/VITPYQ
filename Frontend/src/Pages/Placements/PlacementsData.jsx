import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import "./PlacementData.css"; // Assuming you have a CSS file for styling
import baseUrl from "../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    image: null,
    placementyear: "",
    summary: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        companyName: formData.companyName,
        username: formData.username,
        image: formData.image,
        placementyear: formData.placementyear,
        summary: formData.summary,
        description: formData.description,
      };

      const res = await axios.post(`${baseUrl}/placement`, formDataToSend);
      console.log(res.data); // Assuming you want to log the response
      toast.success("Placement data saved successfully");
      setFormData({
        companyName: "",
        username: "",
        image: null,
        placementyear: "",
        summary: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving placement data");
    }
  };


  return <main className="page-shell publish-page"><header><span className="eyebrow">CAREER HUB · PUBLISH</span><h1 className="page-heading">Turn your interview into <span className="colourchangetext">a playbook.</span></h1><p className="page-subtitle">Capture the company, process, questions and lessons while they're fresh. Your experience can save the next student hours of guesswork.</p></header>
  <form onSubmit={handleSubmit} className="publish-form glass"><div className="publish-section"><span>01 · STORY IDENTITY</span><div className="form-grid"><label>Company name<input className="containerplace" type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. Microsoft"/></label><label>Your name<input className="containerplace" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="How should we credit you?"/></label><label>Placement year<input className="containerplace" type="text" name="placementyear" value={formData.placementyear} onChange={handleChange} placeholder="2026"/></label><label>Cover image<input className="containerplace file-input" type="file" accept="image/*" onChange={handleImageChange}/></label></div></div>
  <div className="publish-section"><span>02 · STORY SUMMARY</span><label>One-line takeaway<input className="containerplace" type="text" name="summary" value={formData.summary} onChange={handleChange} placeholder="The short version students will see first"/></label></div>
  <div className="publish-section"><span>03 · FULL EXPERIENCE</span><p className="editor-help">Share the rounds, questions, preparation strategy and anything you wish you knew beforehand.</p><ReactQuill theme="snow" value={formData.description} onChange={handleEditorChange}/></div>
  <div className="publish-footer"><span>Your story will be added to the Career Hub after submission.</span><button type="submit">Publish story →</button></div></form><ToastContainer/></main>;
};
export default App;
