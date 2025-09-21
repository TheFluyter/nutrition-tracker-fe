import React from 'react';
import { Product } from '../types/Product';
import './ProductDetailsModal.css';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  if (!isOpen || !product) return null;

  const { name, description, nutritionFacts } = product;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{name}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="product-details">
          <div className="description-section">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          <div className="nutrition-section">
            <h3>Complete Nutrition Facts (per 100g)</h3>
            <div className="nutrition-grid">
              <div className="nutrition-item primary">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">{nutritionFacts.calories}</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">{nutritionFacts.protein}g</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Carbohydrates</span>
                <span className="nutrition-value">{nutritionFacts.carbohydrates}g</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">{nutritionFacts.fat}g</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Fiber</span>
                <span className="nutrition-value">{nutritionFacts.fiber}g</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Sugar</span>
                <span className="nutrition-value">{nutritionFacts.sugar}g</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Sodium</span>
                <span className="nutrition-value">{nutritionFacts.sodium}mg</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Vitamin C</span>
                <span className="nutrition-value">{nutritionFacts.vitaminC}mg</span>
              </div>
              
              <div className="nutrition-item">
                <span className="nutrition-label">Potassium</span>
                <span className="nutrition-value">{nutritionFacts.potassium}mg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
