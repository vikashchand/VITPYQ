import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
import React, { useEffect } from 'react';

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

function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize("G-YG5RWFXRK3");
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: document.title });
  }, [location]);
}

function App() {
  usePageViews();

  return (
    <Router>
      <div className="App">
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
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
