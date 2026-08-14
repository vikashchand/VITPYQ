import React, { useState, useEffect } from "react";
import axios from "axios";
import PlacementCard from "./PlacementCard";
import baseUrl from "../../config";
import "./PlacementsPage.css";
import interview from "../../assets/2024placement.pdf";
const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allPlacementsLoaded, setAllPlacementsLoaded] = useState(false);
  const [placementYear, setPlacementYear] = useState(2025); // Default year set to 2025

  useEffect(() => {
    const fetchPlacements = async () => {
      setLoading(true); // Show loading spinner while fetching
      try {
        if (placementYear === 2025) {
          const response = await axios.get(
            `${baseUrl}/placements?page=${page}&pageSize=5&placementYear=2025`
          );
          const newPlacements = response.data;
          if (newPlacements.length === 0) {
            setAllPlacementsLoaded(true);
          } else {
            setPlacements((prevPlacements) =>
              page === 1 ? newPlacements : [...prevPlacements, ...newPlacements]
            );
          }
        } else {
          // Clear placements if the year is not 2025
          setPlacements([]);
          setAllPlacementsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching placements:", error);
      } finally {
        setLoading(false); // Hide loading spinner after fetching
      }
    };

    fetchPlacements();
  }, [page, placementYear]);

  const loadMorePlacements = () => {
    if (!allPlacementsLoaded) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleYearFilter = (event) => {
    const selectedYear = parseInt(event.target.value);
    setPlacementYear(selectedYear);
    setPage(1); // Reset to the first page
    setPlacements([]); // Clear current placements
    setAllPlacementsLoaded(false); // Reset the "all loaded" state
  };


  return (
    <main className="page-shell career-page">
      <header className="career-head"><div><span className="eyebrow">CAREER HUB</span><h1 className="page-heading">Learn from the <span className="colourchangetext">batch ahead.</span></h1><p className="page-subtitle">Real placement stories, interview experiences and practical lessons — captured while they're still useful.</p></div><a className="download-button" href={interview} download>2024 interview pack ↓</a></header>
      <div className="year-tabs"><span>EXPLORE YEAR</span><button className={placementYear===2025?"selected":""} value="2025" onClick={handleYearFilter}>2025</button><button className={placementYear===2024?"selected":""} value="2024" onClick={handleYearFilter}>2024 archive</button></div>
      {placementYear===2024&&<div className="career-callout glass"><div><span className="eyebrow">ARCHIVED INTERVIEWS</span><h3>2024 placement experiences</h3><p>Download the interview compilation and learn from the questions, approaches and lessons shared by your seniors.</p></div><a href={interview} download>Download PDF →</a></div>}
      {loading&&<div className="qp-loading"><span className="loader-ring"/><div><strong>Loading stories…</strong><p>Fetching the latest experiences.</p></div></div>}
      {!loading&&placementYear===2025&&<><div className="story-count">{placements.length} stories loaded</div><div className="placement-cards-container">{placements.map((placement,index)=><PlacementCard key={`placement_${index}`} placement={placement}/>)}</div>{!allPlacementsLoaded&&<div className="load-more-wrap"><button onClick={loadMorePlacements}>Load more stories</button></div>}{allPlacementsLoaded&&placements.length>0&&<p className="archive-end">You've reached the end of the 2025 stories.</p>}</>}
      {!loading&&placementYear===2025&&placements.length===0&&<div className="faculty-empty"><div>◌</div><h3>No stories yet</h3><p>There aren't any published experiences for this year yet.</p></div>}
    </main>
  );
};
export default PlacementsPage;
