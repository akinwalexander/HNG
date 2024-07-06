const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

//  OpenWeatherMap API key
const OPENWEATHERMAP_API_KEY = '914b5c8e72ce34e8d944f20aa7e1355a';

app.get('/api/hello', async (req, res) => {
  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Handle IPv6 loopback address and private IP addresses for testing purposes
  if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.split(':').pop();
  }

  if (clientIp === '::1' || clientIp === '127.0.0.1') {
    clientIp = '8.8.8.8'; // Use a default public IP address for testing
  }

  const visitor_name = req.query.visitor_name || 'Mark'; // Get the name from the query parameter

  try {
    // Get location data from IP using ip-api.com
    const ipApiResponse = await axios.get(`http://ip-api.com/json/${clientIp}?fields=status,message,city`);
    const locationData = ipApiResponse.data;

    if (locationData.status !== 'success') {
      return res.status(500).json({ error: 'Unable to determine location from IP address' });
    }

    const city = locationData.city || 'Unknown location';

    // Get weather data
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`);
    const weatherData = weatherResponse.data;

    const temperature = weatherData.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error(error);
    // Enhanced error handling
    if (error.response && error.response.status === 403) {
      res.status(403).json({ error: 'API key is invalid or has exceeded rate limits' });
    } else if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'The requested resource was not found' });
    } else if (error.response && error.response.status === 500) {
      res.status(500).json({ error: 'Internal server error from IP geolocation or weather API' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
