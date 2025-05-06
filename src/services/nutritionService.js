// frontend/src/services/nutritionService.js
import axios from 'axios';

export async function getNutritionInfo(foodName) {
  try {
    const response = await axios.get(`http://localhost:5001/nutrition/${encodeURIComponent(foodName)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations nutritionnelles:', error);
    throw error;
  }
}