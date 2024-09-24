const express = require('express');
const https = require('https');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); 
mongoose.connect('mongodb+srv://abdulrahmanalsamaraie:Abdo94@cluster0.ir4sp.mongodb.net/flight-reservation?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

const bookingSchema = new mongoose.Schema({
  user: String,
  flightId: String,
  departure: String,
  arrival: String,
  scheduleTime: String,
  price: Number,
});

const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/flights', (req, res) => {
  const options = {
    method: 'GET',
    hostname: 'api.schiphol.nl',
    path: '/public-flights/flights?includedelays=false&page=0&sort=%2BscheduleTime',
    headers: {
      resourceversion: 'v4',
      app_id: '270d7f66',
      app_key: 'd76bc93d48d818f2a79457586a58b9f6',
    },
  };

  const request = https.request(options, (response) => {
    let chunks = [];

    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      res.json(JSON.parse(body));
    });
  });

  request.on('error', (e) => {
    console.error(e);
    res.status(500).send('Error fetching flights');
  });

  request.end();
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); 
    console.log('Fetched bookings:', bookings); 
    res.json(bookings); 
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).send('Error fetching bookings');
  }
});


app.post('/api/book', async (req, res) => {
  const { user, flightId, departure, arrival, scheduleTime, price } = req.body;

  if (!user || !flightId || !departure || !arrival || !scheduleTime || price == null) {
    return res.status(400).json({ error });
  }

  try {
    const newBooking = new Booking({
      user,
      flightId,
      departure,
      arrival,
      scheduleTime,
      price,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Rezervasyonunuz onaylandı', booking: newBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Rezervasyon kaydedilirken hata oluştu', details: error });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
