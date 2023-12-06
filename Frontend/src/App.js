import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login/Login';

import NotFound from './Pages/NotFound';
import Qpupload from './Pages/questionpaper/Upload/Qpuload';
import LandingPage from './Pages/LandingPage/LandingPage';
import Navbar from './components/Nav/Navbar';
import Searchqp from './Pages/questionpaper/Search/Searchqp';
import GlobalSearch from './Pages/questionpaper/GlobalSearch/GlobalSearch';
import FacultyList from './Pages/Faculty/Faculty';
import FacultyData from './Pages/Faculty/FacultyData';



function App() {
  return (
    <Router>
      <div className="App">
      <Navbar/>
      <Routes>
 
      <Route path="/" element={<LandingPage />} />
    
    

      <Route path="/qpupload" element={ <Qpupload/> } />
      <Route path="/searchqp" element={ <Searchqp />} />
      <Route path="/faculty" element={ <FacultyList/> } />
      <Route path="/facultydata" element={<FacultyData/> } />
      <Route path="*" element={<NotFound />} /> {/* Add a catch-all route */}
    </Routes>
    
      </div>
    </Router>
  );
}

export default App;
