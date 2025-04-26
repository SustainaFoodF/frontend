import axios from "axios";

const API_KEY = "2572ed4a0257fa7a987ffd5229836841"; // It's public now, OK for testing
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/onecall";

// 1. Get coordinates (lat/lon) by city name
export const getCoordinatesByCity = async (city = "Tunis") => {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        q: `London`, // TN = Tunisia
        limit: 1,
        appid: API_KEY,
      },
    });

    if (response.data.length === 0) {
      throw new Error("City not found");
    }

    const { lat, lon } = response.data[0];
    return { lat, lon };
  } catch (error) {
    throw new Error("Failed to fetch coordinates");
  }
};

// 2. Get full weather using OneCall API
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat,
        lon,
        exclude: "minutely,alerts",
        appid: API_KEY,
        units: "metric",
        lang: "en",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};
