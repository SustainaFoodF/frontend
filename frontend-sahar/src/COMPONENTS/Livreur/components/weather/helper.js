// src/weatherApi.js
import axios from "axios";

const API_KEY = "babb8c9644bb4d969da170731252904"; // Remplacez par votre clé API WeatherAPI
const BASE_URL = "https://api.weatherapi.com/v1";

export const fetchCurrentWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: city,
        aqi: "no",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
