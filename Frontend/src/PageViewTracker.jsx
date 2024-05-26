import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-YG5RWFXRK3');
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search, title: document.title });
  }, [location]);

  return null;
};

export default PageViewTracker;
