import React from 'react';
import { Product } from '../types/Product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const { name, description, nutritionFacts } = product;

  return (
    <div className="product-card">
      <div className="product-header">
        <div className="product-title-section">
          <h2 className="product-name">{name}</h2>
          <button 
            className="edit-button"
            onClick={() => onEdit(product)}
            title="Edit product"
          >
            ✏️
          </button>
        </div>
        <p className="product-description">{description}</p>
      </div>
      
      <div className="nutrition-section">
        <h3 className="nutrition-title">Nutrition Facts</h3>
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
  );
};

export default ProductCard;
