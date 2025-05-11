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
    <div className="placements-page">
      <h1 className="page-title">Placements Insights</h1>
      <div className="filter-dropdown">
        <label htmlFor="yearFilter">Filter by Year: </label>
        <select
          id="yearFilter"
          value={placementYear}
          onChange={handleYearFilter}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {/* Conditionally render the PDF link for 2024 */}
      {placementYear === 2024 && (
        <div className="pdf-link">
          <a href={interview} download>
            {" "}
            download interview pdf
          </a>
        </div>
      )}

      {/* Show loading spinner */}
      {loading && (
        <div className="lds-facebook">
          {" "}
          Loading<div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {/* Render placement cards only for 2025 */}
      {!loading && placementYear === 2025 && (
        <div className="placement-cards-container">
          {placements.map((placement, index) => (
            <PlacementCard key={`placement_${index}`} placement={placement} />
          ))}
        </div>
      )}

      {/* Show "Next" button only for 2025 */}
      {!loading && placementYear === 2025 && !allPlacementsLoaded && (
        <button onClick={loadMorePlacements}>Next</button>
      )}

      {/* Show "No more data" message only for 2025 */}
      {!loading && placementYear === 2025 && allPlacementsLoaded && (
        <h2>No more data available</h2>
      )}
    </div>
  );
};

export default PlacementsPage;
