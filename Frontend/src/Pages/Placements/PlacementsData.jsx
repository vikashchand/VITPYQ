import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './PlacementData.css'; // Assuming you have a CSS file for styling
import baseUrl from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    image: null,
    summary: '',
    description: '',
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
        summary: formData.summary,
        description: formData.description,
      };

      const res = await axios.post(`${baseUrl}/placement`, formDataToSend);
      console.log(res.data); // Assuming you want to log the response
      toast.success('Placement data saved successfully');
      setFormData({
        companyName: '',
        username: '',
        image: null,
        summary: '',
        description: '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Error saving placement data');
    }
  };

  return (
    <div className="containerp">
      <h1>Placement Blog</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name:</label>
          <input className='containerplace' type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input className='containerplace' type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input className='containerplace' type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="form-group">
          <label>Summary:</label>
          <input className='containerplace' type='text' name="summary" value={formData.summary} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Detailed Description:</label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleEditorChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
