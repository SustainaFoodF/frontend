import React, { useState, useRef } from 'react';
import { Button, Alert, Form, Spinner } from 'react-bootstrap';
import Quagga from 'quagga';
import { FaTimes } from 'react-icons/fa';
import './BarcodeScanner.css'; 

const BarcodeScanner = () => {
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          inputStream: { size: 800 }
        }, result => resolve(result?.codeResult?.code));
      });

      if (!barcode) throw new Error("Aucun code-barres détecté");

      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 0) throw new Error("Produit non trouvé");

      const productData = data.product;

      const processedProduct = {
        name: productData.product_name || 'Nom inconnu',
        brand: productData.brands,
        image: productData.image_url,
        ingredients: productData.ingredients_text || 'Non spécifié',
        nutrients: productData.nutriments || {},
        ecoScore: productData.ecoscore_grade || 'non-disponible',
        novaGroup: productData.nova_group || 0
      };

      setProduct(processedProduct);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEcoScoreColor = (score) => {
    const colors = {
      'a': '#2ecc71', 'b': '#27ae60', 'c': '#f39c12', 
      'd': '#e74c3c', 'e': '#c0392b'
    };
    return colors[score.toLowerCase()] || '#cccccc';
  };

  const getNovaGroupInfo = (group) => {
    const groups = {
      1: { name: "Aliments non transformés", color: "#2ecc71" },
      2: { name: "Ingrédients culinaires", color: "#27ae60" },
      3: { name: "Aliments transformés", color: "#f39c12" },
      4: { name: "Aliments ultra-transformés", color: "#e74c3c" }
    };
    return groups[group] || { name: "Inconnu", color: "#cccccc" };
  };

  return (
    <div className="text-center" style={{ padding: '20px' }}>
      <Button 
        variant="primary"
        onClick={() => setShowModal(true)}
        style={{
          padding: '12px 25px',
          fontSize: '1.1rem',
          margin: '20px 0',
          borderRadius: '8px'
        }}
      >
        Scanner un Produit
      </Button>

      {/* Popup de scan */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1050
        }}>
          <div style={{
            width: '350px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            position: 'relative',
            padding: '25px'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
            
            <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>
              Scanner un produit
            </h4>
            
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isLoading}
              style={{
                marginBottom: '15px',
                border: '2px dashed #ddd',
                padding: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            />
            
            {isLoading && (
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <Spinner animation="border" />
                <p style={{ marginTop: '10px' }}>Analyse en cours...</p>
              </div>
            )}
            
            {error && (
              <Alert variant="danger" style={{ marginTop: '15px' }}>
                {error}
              </Alert>
            )}
          </div>
        </div>
      )}

      {/* Affichage du produit avec bouton de fermeture */}
      {product && (
        <div style={{
          position: 'relative',
          maxWidth: '700px',
          margin: '20px auto',
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          {/* Bouton de fermeture */}
          <button 
            onClick={() => setProduct(null)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#666',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <FaTimes />
          </button>

          <h2 style={{ marginBottom: '10px', paddingRight: '30px' }}>{product.name}</h2>
          {product.brand && <p>Marque: {product.brand}</p>}

          {product.image && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <img 
                src={product.image} 
                style={{ 
                  maxHeight: '200px',
                  maxWidth: '100%',
                  borderRadius: '5px'
                }} 
                alt={product.name} 
              />
            </div>
          )}

          <div style={{ margin: '20px 0' }}>
            <h4>Ingrédients</h4>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px'
            }}>
              <p>{product.ingredients}</p>
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <h4>Informations Nutritionnelles (pour 100g)</h4>
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px'
            }}>
              {product.nutrients && (
                <div>
                  {product.nutrients.energy && (
                    <p>Énergie: {product.nutrients.energy} {product.nutrients.energy_unit || 'kcal'}</p>
                  )}
                  {product.nutrients.fat && (
                    <p>Matières grasses: {product.nutrients.fat}g</p>
                  )}
                  {product.nutrients.saturated_fat && (
                    <p>Dont acides gras saturés: {product.nutrients.saturated_fat}g</p>
                  )}
                  {product.nutrients.carbohydrates && (
                    <p>Glucides: {product.nutrients.carbohydrates}g</p>
                  )}
                  {product.nutrients.sugars && (
                    <p>Dont sucres: {product.nutrients.sugars}g</p>
                  )}
                  {product.nutrients.proteins && (
                    <p>Protéines: {product.nutrients.proteins}g</p>
                  )}
                  {product.nutrients.salt && (
                    <p>Sel: {product.nutrients.salt}g</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            {product.ecoScore && product.ecoScore !== 'non-disponible' && (
              <div style={{ flex: 1 }}>
                <h4>EcoScore</h4>
                <div style={{
                  backgroundColor: getEcoScoreColor(product.ecoScore),
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: '10px auto'
                }}>
                  {product.ecoScore.toUpperCase()}
                </div>
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h4>NOVA</h4>
              <div style={{
                backgroundColor: getNovaGroupInfo(product.novaGroup).color,
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '10px auto'
              }}>
                {product.novaGroup}
              </div>
              <p style={{ textAlign: 'center' }}>
                {getNovaGroupInfo(product.novaGroup).name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;