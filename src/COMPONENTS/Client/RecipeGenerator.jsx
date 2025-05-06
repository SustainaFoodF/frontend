import React, { useState, useEffect, useRef } from 'react';
import './RecipeGenerator.css';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [mealType, setMealType] = useState('dinner');
  const [cuisine, setCuisine] = useState('Italian');
  const [cookingTime, setCookingTime] = useState('medium');
  const [complexity, setComplexity] = useState('medium');
  const [dietary, setDietary] = useState([]);
  const [numberOfRecipes, setNumberOfRecipes] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem('savedRecipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');
  const recipeRef = useRef(null);

  useEffect(() => {
    if (recipeRef.current) {
      recipeRef.current.scrollTop = recipeRef.current.scrollHeight;
    }
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const handleDietaryChange = (diet) => {
    setDietary(prev => 
      prev.includes(diet) 
        ? prev.filter(item => item !== diet)
        : [...prev, diet]
    );
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients');
      return;
    }
  
    setLoading(true);
    setRecipes([]);
    setError('');
  
    try {
      const params = new URLSearchParams({
        ingredients,
        mealType,
        cuisine,
        cookingTime,
        complexity,
        dietary: dietary.join(','),
        numberOfRecipes,
      });
  
      const eventSource = new EventSource(`http://localhost:5001/recipe/recipeStream?${params.toString()}`);
      let currentRecipe = { id: Date.now(), content: '', title: '' };
  
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        if (data.action === 'close') {
          eventSource.close();
          setLoading(false);
        } else if (data.chunk) {
          if (data.newRecipe) {
            // Save the current recipe and start a new one
            setRecipes(prev => [...prev, currentRecipe]);
            currentRecipe = { id: Date.now(), content: data.chunk, title: data.title || '' };
          } else {
            // Update the current recipe
            currentRecipe.content += data.chunk;
            if (!currentRecipe.title && data.chunk.includes('🍽 Recipe:')) {
              const titleMatch = data.chunk.match(/🍽 Recipe: (.*)\n/);
              if (titleMatch && titleMatch[1]) {
                currentRecipe.title = titleMatch[1];
              }
            }
            setRecipes(prev => [...prev.slice(0, -1), currentRecipe]);
          }
        }
      };
  
      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
        setError('Error generating recipe. Please try again later.');
      };
    } catch (error) {
      setLoading(false);
      setError('Error connecting to the server. Please try again later.');
      console.error('Error:', error);
    }
  };

  const saveRecipe = (recipe) => {
    setSavedRecipes(prev => [...prev, recipe]);
  };

  const deleteRecipe = (id) => {
    setSavedRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const toggleSavedRecipes = () => {
    setShowSaved(!showSaved);
  };
  
  return (
    <div className="recipe-generator">
      <h1>AI Recipe Generator</h1>
      
      <div className="main-controls">
        <button 
          className={`tab-button ${!showSaved ? 'active' : ''}`} 
          onClick={() => setShowSaved(false)}
        >
          Generate Recipes
        </button>
        <button 
          className={`tab-button ${showSaved ? 'active' : ''}`} 
          onClick={toggleSavedRecipes}
        >
          Saved Recipes ({savedRecipes.length})
        </button>
      </div>

      {!showSaved ? (
        <>
          <div className="input-section">
            <div className="ingredients-input">
              <label htmlFor="ingredients">What ingredients do you have?</label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients separated by commas (e.g., chicken, rice, garlic, onion)"
                disabled={loading}
              />
            </div>
            
            <div className="options-container">
              <div className="options-grid">
                <div className="option-group">
                  <label htmlFor="mealType">Meal Type</label>
                  <select 
                    id="mealType" 
                    value={mealType} 
                    onChange={(e) => setMealType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="dessert">Dessert</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                
                <div className="option-group">
                  <label htmlFor="cuisine">Cuisine</label>
                  <select 
                    id="cuisine" 
                    value={cuisine} 
                    onChange={(e) => setCuisine(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="French">French</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="American">American</option>
                    <option value="Thai">Thai</option>
                    <option value="Middle Eastern">Middle Eastern</option>
                  </select>
                </div>
                
                <div className="option-group">
                  <label htmlFor="cookingTime">Cooking Time</label>
                  <select 
                    id="cookingTime" 
                    value={cookingTime} 
                    onChange={(e) => setCookingTime(e.target.value)}
                    disabled={loading}
                  >
                    <option value="quick">Quick (under 30 min)</option>
                    <option value="medium">Medium (30-60 min)</option>
                    <option value="long">Long (over 60 min)</option>
                  </select>
                </div>
                
                <div className="option-group">
                  <label htmlFor="complexity">Complexity</label>
                  <select 
                    id="complexity" 
                    value={complexity} 
                    onChange={(e) => setComplexity(e.target.value)}
                    disabled={loading}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>

                <div className="option-group">
                  <label htmlFor="numberOfRecipes">Number of Recipes</label>
                  <select 
                    id="numberOfRecipes" 
                    value={numberOfRecipes} 
                    onChange={(e) => setNumberOfRecipes(Number(e.target.value))}
                    disabled={loading}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>

              <div className="dietary-options">
                <label>Dietary Restrictions:</label>
                <div className="checkbox-group">
                  {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'].map(diet => (
                    <label key={diet} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={dietary.includes(diet)}
                        onChange={() => handleDietaryChange(diet)}
                        disabled={loading}
                      />
                      {diet.charAt(0).toUpperCase() + diet.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              className="generate-button" 
              onClick={generateRecipe}
              disabled={loading || !ingredients.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Recipe'
              )}
            </button>
          </div>
          
          <div className="recipe-output">
            <h2>Your Recipes</h2>
            {loading && recipes.length === 0 && (
              <div className="loading-placeholder">
                <div className="spinner"></div>
                <p>Finding delicious recipes...</p>
              </div>
            )}
            
            {recipes.length > 0 ? (
              <div ref={recipeRef} className="recipes-list">
                {recipes.map((recipe, index) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-header">
                      <h3>{recipe.title || `Recipe ${index + 1}`}</h3>
                      <button 
                        className="save-button"
                        onClick={() => saveRecipe(recipe)}
                        disabled={savedRecipes.some(r => r.id === recipe.id)}
                      >
                        {savedRecipes.some(r => r.id === recipe.id) ? 'Saved ✓' : 'Save Recipe'}
                      </button>
                    </div>
                    <div className="recipe-content">
                      {recipe.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <div className="empty-state">Your recipes will appear here</div>
            )}
          </div>
        </>
      ) : (
        <div className="saved-recipes">
          <h2>Your Saved Recipes</h2>
          {savedRecipes.length > 0 ? (
            <div className="recipes-list">
              {savedRecipes.map((recipe, index) => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-header">
                    <h3>{recipe.title || `Saved Recipe ${index + 1}`}</h3>
                    <button 
                      className="delete-button"
                      onClick={() => deleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="recipe-content">
                    {recipe.content}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No saved recipes yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;