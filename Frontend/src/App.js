import './App.css';
import { Analytics } from '@vercel/analytics/react';
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
import PlacementsData from './Pages/Placements/PlacementsData';
import PlacementsPage from './Pages/Placements/PlacementPage';
import PlacementDetails from './Pages/Placements/PlacementDetails';
import Accessories from './Pages/accessories/Accessories';
import AdSenseAd from './Pages/AdSenseAd';


function App() {
  return (
    <Router>
      <div className="App ">
      <Navbar/>
      
      <Routes>
 
      <Route path="/" element={<LandingPage />} />
    
    

      <Route path="/qpupload" element={ <Qpupload/> } />
      <Route path="/searchqps" element={ <Searchqp />} />
      <Route path="/faculty" element={ <FacultyList/> } />
      <Route path="/facultydata" element={<FacultyData/> } />
      <Route path="/accessories" element={<Accessories/> } />
      <Route path="/placementdata" element={<PlacementsData/> } />
      <Route path="/placementblogs" element={<PlacementsPage/> } />
      <Route path="/placement/:id" element={<PlacementDetails/>} />
      <Route path="*" element={<NotFound />} /> {/* Add a catch-all route */}
    </Routes>

 <AdSenseAd/>
   
      </div>
    </Router>
  );
}

export default App;
