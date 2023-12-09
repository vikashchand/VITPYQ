
import React, { useState } from 'react';
import axios from 'axios';
import './Faculty.css'
import baseUrl from '../../config';
import { ToastContainer, toast } from 'react-toastify';

  
const FacultyReviewForm = () => {
    const [name, setName] = useState('');
    const [review, setReview] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate input fields
      if (!name.trim() || !review.trim()) {
        toast.error('Name and Review cannot be empty');
        return;
      }
  
      try {
        const response = await axios.post(`${baseUrl}/reviews`, {
          name,
          reviews: [{ review }],
        });
  
        console.log(response.data);
        // Display a success message based on your response structure
        toast.success('Review submitted successfully');
        // Reset the form fields after successful submission
        setName('');
        setReview('');
      } catch (error) {
        console.error('Error submitting review:', error);
        toast.error('Error submitting review');
      }
    };
  
    return (
      <div className='faculty-search-container'>
        <h1>Faculty Review Form</h1>
        <br />
        <ToastContainer />
        <form onSubmit={handleSubmit} className="facultyform">
          <label>
            Faculty Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              className="facultyname"
            />
          </label>
          <br />
          <label>
            Review:
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </label>
          <br />
          <button className='formbt' type="submit">Submit Review</button>
        </form>
      </div>
    );
  };
  
  export default FacultyReviewForm;
  