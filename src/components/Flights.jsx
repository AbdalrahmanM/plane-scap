import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FlightsPage = () => {
  const [bookings, setBookings] = useState([]); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings'); 
        console.log(response.data); 
        if (Array.isArray(response.data)) {
          setBookings(response.data); 
        } else {
          throw new Error('Kurtarılan veriler bir dizi değil');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error.message); 
      }
    };

    fetchBookings();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <header className="bg-white shadow p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Rezervasyonlarım</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>Times</li>
              <li>Stops</li>
              <li>Airlines</li>
              <li>Airports</li>
              <li>Amenities</li>
              <li>Edit Search</li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="space-y-4">
        {error && <div className="text-red-500">{error}</div>} 
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.flightId} className="bg-white shadow-md p-4 rounded-lg grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <div className="font-semibold text-lg">{booking.scheduleTime}</div>
                <div className="text-sm text-gray-600">{booking.airline || 'bilinmiyor'}</div> 
                <div className="text-sm">{booking.departure}  {booking.arrival}</div>
                <div className="text-sm text-blue-500">Seyahat ayrıntıları</div>
              </div>
              <div className="col-span-6 flex justify-end space-x-4">
                <div className="text-center">
                  <div className="font-semibold">${booking.price}</div>
                  <div className="text-sm text-gray-500">fiyat</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">Rezervasyon mevcut değil.</div>
        )}
      </div>
    </div>
  );
};

export default FlightsPage;
