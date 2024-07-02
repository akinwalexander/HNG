const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

//API key
const OPENWEATHERMAP_API_KEY = '914b5c8e72ce34e8d944f20aa7e1355a';

app.get('/', async (req, res) => {
  const clientIp = req.ip === '::1' ? '127.0.0.1' : req.ip; // Handle localhost address

  try {
    // Get location and weather data from IP
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=New York&units=metric&appid=${OPENWEATHERMAP_API_KEY}`);
    const weatherData = weatherResponse.data;

    const city = weatherData.name;
    const temperature = weatherData.main.temp;
    const name = 'Mark'; // Replace with dynamic data if needed

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});