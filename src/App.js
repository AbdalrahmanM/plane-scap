import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlightSearch from './components/FlightSearch';
import Flights from './components/Flights'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-purple-100 p-4 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<FlightSearch />} />
          <Route path="/flights" element={<Flights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
