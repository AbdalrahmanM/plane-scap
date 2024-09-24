import React, { useState, useEffect } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from 'react-icons/fa';
import image from '../assets/1.jpeg';
import image2 from '../assets/2.jpeg';
import image3 from '../assets/3.jpg';
import { Link } from 'react-router-dom';

const FlightSearch = () => {
  const [tripType, setTripType] = useState('round');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [reservation, setReservation] = useState(null); 

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/flights'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); 
      const filteredFlights = data.flights.filter((flight) => {
        const origin = flight.route?.destinations[0]?.toLowerCase(); 
        const destination = flight.route?.destinations[1]?.toLowerCase();
        const flightDate = flight.scheduleDate; 
        return (
          origin === departure.toLowerCase() &&
          destination === arrival.toLowerCase() &&
          flightDate === date
        );
      });

      setFlights(filteredFlights);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async (flight) => {
    try {
      const response = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightNumber: flight.flightNumber,
          departure: flight.route?.destinations[0],
          arrival: flight.route?.destinations[1],
          scheduleTime: flight.scheduleTime,
          price: flight.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book flight');
      }

      const result = await response.json();
      setReservation(result); 
      alert('Flight booked successfully!');
    } catch (error) {
      console.error('Error booking flight:', error);
      alert('Error booking flight.');
    }
  };

  return (
    <div className="bg-gray-100 w-full max-w-6xl mx-auto p-8 rounded-lg shadow-lg">

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-4" />
          <h1 className="text-xl font-bold">Plane Scape</h1>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-purple-600 hover:underline">Deals</a>
          <a href="#" className="text-purple-600 hover:underline">Discover</a>
          <Link to="/flights" className="text-purple-600 hover:underline">Joanne Smith</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-3 space-y-6">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FaPlaneDeparture className="mr-2 text-purple-600" />
              <h2 className="text-lg font-bold">Book Your Flight</h2>
            </div>

            <div className="flex justify-end space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full border ${tripType === 'round' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                onClick={() => setTripType('round')}
              >
                Round trip
              </button>
              <button
                className={`px-4 py-2 rounded-full border ${tripType === 'one-way' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                onClick={() => setTripType('one-way')}
              >
                One way
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <FaPlaneDeparture className="absolute left-3 top-3 text-purple-600" />
                <input
                  type="text"
                  placeholder="Departure"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)} 
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="relative">
                <FaPlaneArrival className="absolute left-3 top-3 text-purple-600" />
                <input
                  type="text"
                  placeholder="Arrival"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)} 
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-purple-600" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={fetchFlights}
              className="bg-purple-600 text-white w-full p-2 rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Show flights'}
            </button>
          </div>

          <div className="space-y-4">
            {flights.length > 0 ? (
              flights.map((flight, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-semibold">{flight.route?.destinations[0]} - {flight.route?.destinations[1]}</p>
                      <p>Departure: {flight.scheduleTime}</p>
                      <p>Flight Number: {flight.flightNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${flight.price}</p>
                      <button
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
                        onClick={() => handleBookFlight(flight)}
                      >
                        Book Flight
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No flights available for the selected criteria.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md">
            <img src={image} alt="Car Rentals" className="w-full h-32 object-cover rounded-lg mb-4" />
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <img src={image2} alt="Hotels" className="w-full h-32 object-cover rounded-lg mb-4" />
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <img src={image3} alt="Travel Packages" className="w-full h-32 object-cover rounded-lg mb-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
