// src/components/WeatherComponent.js
import React, { useState } from "react";
import { fetchCurrentWeather } from "./helper";
import "./weather.css";

const WeatherComponent = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchCurrentWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError("City not found or connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h2>Live Weather</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
      />
      <button onClick={getWeather}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-info">
          <h3>{weatherData.location.country}</h3>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img src={weatherData.current.condition.icon} alt="Weather icon" />
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
