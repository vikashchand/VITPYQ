import React from 'react'
import { Link } from 'react-router-dom';
import pdf from '../../assets/mis.xlsx'
const Accessories = () => {
  return (
    <div className="feature-container">
        <div className="feature-description">
        
          <ul className="feature-cards">
            <li className="feature-card">
              <div className="feature-icon">
               
              </div>
              <div className="feature-details">
                <h3> Nptel</h3>
                
                <p>NPTEL quiz app for giving mock exams</p>
                <p>Curently one can give mocks for wildlife ecology,conservation economics,Forest and management</p>
<p>in these subjects one can easily get S or A grade by studying one day before</p>
<p>don't take hard nptel courses like coding related it would be very difficult to score even B grade </p>

              <button >   <Link className='lin' to="https://nptelquiz.vercel.app">NPTEL  </Link> </button>


              



<button >   <Link className='lin' to="https://quizme-rho.vercel.app/">NPTEL  </Link> </button>


Made by 
<a href="https://www.linkedin.com/in/yuvraj-singh-deora-06aug2001/">
Yuvraj singh deora
</a> 

            
              </div>
            </li>

            <li className="feature-card">
            
          
                <h3>Comprehensive exam </h3>
               
<p>This exam consist of mcq questions from every semesters ,student have to mugup 1500 questions  </p>
<p>exam has 100 questions each of 1 marks and have absoulte grading</p>

<p>
               
<button >   <Link className='lin' to="https://quiz-me-zeta.vercel.app/">Pdf  </Link> </button>



Made by 
<a href="https://www.linkedin.com/in/yuvraj-singh-deora-06aug2001/" >
Yuvraj singh deora
</a> 

</p>




           
            </li>

            <li className="feature-card">
            <div className="feature-icon">
        
            </div>
            <div className="feature-details">
              <h3>Placements </h3>
      
              <p>Past year Placements</p>
              <p>List of companies that came last year and their packages</p>
                         
              <button > <a href={pdf} download> download sheet</a>  </button>
 
              </div>
          </li>
  
           
          <li className="feature-card">
          <div className="feature-icon">
      
          </div>
          <div className="feature-details">
            <h3>Notes</h3>
    
            <p>Student Dashboard - MIS Branch, VIT Vellore </p>
                       
<button >   <Link className='lin' to="https://mis-notes.notion.site/Student-Dashboard-MIS-Branch-VIT-Vellore-325fa0bf8fe341cd82cfb9bd9dd15260">NOTION  </Link> </button>
              


Made by <a href="https://www.linkedin.com/in/pranitmodi/" >
Pranit Modi
</a> 







            </div>
        </li>

        

      
            
           
          </ul>
        </div>

       
      </div>
  )
}

export default Accessories