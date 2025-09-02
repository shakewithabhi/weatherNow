// src/WeatherApp.jsx
import React, { useState } from "react";
import axios from "axios";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!/^[a-zA-Z\s]+$/.test(city) || city.length < 3) {
      setError(
        "Please enter a valid city name (min 3 letters, only alphabets)."
      );
      return;
    }

    try {
      setError("");
      setWeather(null);
      setLoading(true);

      // Geocoding API
      const coordinates = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&min_population=50000`
      );

      console.log(coordinates.data);

      if (!coordinates.data.results || coordinates.data.results.length === 0) {
        setError("City not Found! Guess you are from Mars 🚀");
        setLoading(false);
        return;
      }
 
      //setting longitude and latitude from the data at zero index of the array
      const { latitude, longitude } = coordinates.data.results[0];

      // Weather API
      const weatherData = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      setWeather(weatherData.data.current_weather);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setCity("");
    setWeather(null);
    setError("");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-orange-800 p-4">
        <h2 className="text-3xl font-bold mb-2">🌤️ Weather Now</h2>
        <p className="text-gray-700 mb-6">
          Check the current weather in your city
        </p>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={getWeather}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Get Weather
          </button>

          <button
            onClick={resetData}
            className="px-4 py-2 rounded-lg border border-gray-400 bg-white hover:bg-gray-100 transition"
          >
            Reset
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading */}
        {loading && <p className="text-gray-600 mb-4">Loading...</p>}

        {/* Weather card */}
        {weather && !loading && (
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Weather Details</h3>
            <p className="text-lg">🌡️ Temperature: {weather.temperature}°C</p>
            <p className="text-lg">💨 Wind Speed: {weather.windspeed} km/h</p>
          </div>
        )}
      </div>
    </>
  );
}

export default WeatherApp;
