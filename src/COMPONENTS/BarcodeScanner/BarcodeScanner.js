import React, { useState, useRef } from 'react';
import { Button, Modal, Alert, Form, Spinner } from 'react-bootstrap';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setProduct(null);

    try {
      const barcode = await new Promise((resolve) => {
        Quagga.decodeSingle({
          src: URL.createObjectURL(file),
          decoder: { readers: ["ean_reader", "ean_8_reader"] },
          locate: true,
          numOfWorkers: 4,
          inputStream: {
            size: 800
          }
        }, result => resolve(result?.codeResult?.code));
      });

      if (!barcode) throw new Error("No barcode detected");

      const response = await fetch(`/barcode/scan/${barcode}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API error");

      console.log("Raw API data:", data);

      // Process product data
      const processedProduct = {
        ...data,
        formattedIngredients: formatIngredients(data.ingredients),
        formattedNutrients: formatNutrients(data.nutrients)
      };

      setProduct(processedProduct);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      console.error("Scan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatIngredients = (ingredientsText) => {
    if (!ingredientsText) return [];

    const ingredientsList = [];
    const items = ingredientsText.split(',');

    items.forEach(item => {
      const parenMatch = item.match(/(.*?)\s*\(([^)]+)\)/);
      if (parenMatch) {
        ingredientsList.push({
          name: parenMatch[1].trim(),
          quantity: parenMatch[2].trim()
        });
        return;
      }

      const colonMatch = item.match(/(.*?)\s*:\s*(.*)/);
      if (colonMatch) {
        ingredientsList.push({
          name: colonMatch[1].trim(),
          quantity: colonMatch[2].trim()
        });
        return;
      }

      const spaceMatch = item.match(/(.*?)\s+(\d+.*)/);
      if (spaceMatch) {
        ingredientsList.push({
          name: spaceMatch[1].trim(),
          quantity: spaceMatch[2].trim()
        });
        return;
      }

      if (item.trim() !== '' && item.trim() !== '0') {
        ingredientsList.push({
          name: item.trim(),
          quantity: ''
        });
      }
    });

    return ingredientsList;
  };

  const formatNutrients = (nutrients) => {
    if (!nutrients) return [];
    
    const nutrientList = [];
    
    // Sodium
    if (nutrients.sodium_value) {
      nutrientList.push({
        name: "Sodium",
        value: nutrients.sodium_value,
        unit: nutrients.sodium_unit || 'mg'
      });
    }
    
    // Salt
    if (nutrients.salt_value) {
      nutrientList.push({
        name: "Sel",
        value: nutrients.salt_value,
        unit: nutrients.salt_unit || 'mg'
      });
    }
    
    // Nutrition Score
    if (nutrients['nutrition-score-fr_100g']) {
      nutrientList.push({
        name: "Score Nutritionnel",
        value: nutrients['nutrition-score-fr_100g'],
        unit: '/100g'
      });
    }
    
    // NOVA Group
    if (nutrients['nova-group']) {
      nutrientList.push({
        name: "NOVA Group",
        value: nutrients['nova-group'],
        unit: ''
      });
    }
    
    return nutrientList;
  };

  const getEcoScoreColor = (score) => {
    switch (score.toLowerCase()) {
      case 'a': return '#2ecc71';
      case 'b': return '#27ae60';
      case 'c': return '#f39c12';
      case 'd': return '#e74c3c';
      case 'e': return '#c0392b';
      default: return 'var(--col1)';
    }
  };

  return (
    <div className="text-center" style={{ padding: '20px' }}>
      {/* Scan Button */}
      <Button 
        className="scanner-button"
        style={{
          color: 'white',
          border: 'none',
          padding: '12px 25px',
          fontSize: '1.1rem',
          margin: '20px 0',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
        onClick={() => setShowModal(true)}
      >
        Scanner un Produit
      </Button>

      {/* Upload Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        contentClassName="border-0"
      >
        <Modal.Body style={{ 
          backgroundColor: 'var(--col3)', 
          padding: '25px',
          borderRadius: '10px'
        }}>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isLoading}
            className="mb-3"
          />
          {isLoading && <Spinner animation="border" />}
          {error && (
            <Alert variant="danger" style={{ 
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none'
            }}>
              {error}
            </Alert>
          )}
        </Modal.Body>
      </Modal>

      {/* Product Display */}
      {product && (
        <div className="product-display" style={{
          maxWidth: '700px',
          margin: '20px auto',
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid var(--col1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          {/* Product Header */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ 
              color: 'var(--col1)',
              fontWeight: '300',
              marginBottom: '5px'
            }}>
              {product.name}
            </h2>
            {product.brand && (
              <p style={{ color: 'var(--col2)' }}>
                <strong>Marque:</strong> {product.brand}
              </p>
            )}
          </div>

          {/* Product Image */}
          {product.image && (
            <div style={{
              margin: '0 auto 20px',
              textAlign: 'center'
            }}>
              <img 
                src={product.image} 
                style={{ 
                  maxHeight: '250px',
                  maxWidth: '100%',
                  border: '1px solid var(--col3)',
                  borderRadius: '5px'
                }} 
                alt={product.name} 
              />
            </div>
          )}

          {/* Nutrition Facts */}
          {product.formattedNutrients?.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                color: 'var(--col1)',
                borderBottom: '1px solid var(--col3)',
                paddingBottom: '8px',
                marginBottom: '15px',
                fontSize: '1.2rem'
              }}>
                Informations Nutritionnelles
              </h4>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px'
              }}>
                {product.formattedNutrients.map((nutrient, index) => (
                  <div key={index} style={{ 
                    margin: '8px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{nutrient.name}</span>
                    <span style={{ color: 'var(--col2)' }}>
                      {nutrient.value} {nutrient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients with Quantities */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{
              color: 'var(--col1)',
              borderBottom: '1px solid var(--col3)',
              paddingBottom: '8px',
              marginBottom: '15px',
              fontSize: '1.2rem'
            }}>
              Ingrédients
            </h4>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px'
            }}>
              {product.formattedIngredients?.length > 0 ? (
                product.formattedIngredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      margin: '8px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ flex: 2 }}>
                      <span style={{ 
                        color: 'var(--col1)',
                        marginRight: '8px'
                      }}>•</span>
                      {ingredient.name}
                    </span>
                    {ingredient.quantity && (
                      <span style={{
                        flex: 1,
                        color: 'var(--col2)',
                        fontSize: '0.85rem',
                        textAlign: 'right',
                        paddingLeft: '10px'
                      }}>
                        {ingredient.quantity}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--col2)', fontStyle: 'italic' }}>
                  {product.ingredients || 'Aucune information d\'ingrédients disponible'}
                </p>
              )}
            </div>
          </div>

          {/* EcoScore */}
          {product.ecoScore && product.ecoScore !== 'not-applicable' && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{
                color: 'var(--col1)',
                borderBottom: '1px solid var(--col3)',
                paddingBottom: '8px',
                marginBottom: '15px',
                fontSize: '1.2rem'
              }}>
                EcoScore
              </h4>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: getEcoScoreColor(product.ecoScore),
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  lineHeight: '60px',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: '0 auto'
                }}>
                  {product.ecoScore.toUpperCase()}
                </div>
                <p style={{ 
                  marginTop: '10px',
                  color: 'var(--col1)',
                  fontWeight: '500'
                }}>
                  {getEcoScoreDescription(product.ecoScore)}
                </p>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {product.recommendation && (
            <div style={{
              padding: '15px',
              backgroundColor: 'var(--col3)',
              borderRadius: '5px',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <p style={{ 
                color: 'var(--col1)',
                fontWeight: '500',
                margin: 0,
                fontSize: '1.1rem'
              }}>
                {product.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const getEcoScoreDescription = (score) => {
  const descriptions = {
    'a': 'Impact environnemental très faible',
    'b': 'Impact environnemental faible',
    'c': 'Impact environnemental modéré',
    'd': 'Impact environnemental élevé',
    'e': 'Impact environnemental très élevé'
  };
  return descriptions[score.toLowerCase()] || 'Score environnemental';
};

export default BarcodeScanner;