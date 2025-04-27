import { useEffect, useState } from "react";
import "./weather.css";
import { getCoordinatesByCity, getWeatherByCoordinates } from "./helper";

function Weather() {
  const [city, setCity] = useState("Tunis");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { lat, lon } = await getCoordinatesByCity(city);
      const weatherData = await getWeatherByCoordinates(lat, lon);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="app-container">
      <h1>🇹🇳 Tunisia Weather App</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (ex: Sfax, Sousse)"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>🌍 {city}</h2>
          <p>{weather.current.weather[0].description}</p>
          <p>🌡 Temperature: {Math.round(weather.current.temp)}°C</p>
          <p>💧 Humidity: {weather.current.humidity}%</p>
          <p>💨 Wind: {weather.current.wind_speed} m/s</p>

          {/* Tomorrow Forecast */}
          <h3>📅 Tomorrow's Forecast</h3>
          <p>
            🌡 Min: {Math.round(weather.daily[1].temp.min)}°C / Max:{" "}
            {Math.round(weather.daily[1].temp.max)}°C
          </p>
          <p>Condition: {weather.daily[1].weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
