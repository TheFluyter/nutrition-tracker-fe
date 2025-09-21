import React from 'react';
import { Product } from '../types/Product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onViewDetails }) => {
  const { name, nutritionFacts } = product;

  return (
    <div 
      className="product-card clickable"
      onClick={() => onViewDetails(product)}
      title="Click to view details"
    >
      <div className="product-content">
        <div className="product-info">
          <h2 className="product-name">
            {name}
          </h2>
        </div>
        
        <div className="nutrition-overview">
          <div className="nutrition-item primary">
            <span className="nutrition-value">{nutritionFacts.calories}</span>
            <span className="nutrition-label">cal</span>
          </div>
          
          <div className="nutrition-item">
            <span className="nutrition-value">{nutritionFacts.protein}g</span>
            <span className="nutrition-label">protein</span>
          </div>
          
          <div className="nutrition-item">
            <span className="nutrition-value">{nutritionFacts.carbohydrates}g</span>
            <span className="nutrition-label">carbs</span>
          </div>
          
          <div className="nutrition-item">
            <span className="nutrition-value">{nutritionFacts.fat}g</span>
            <span className="nutrition-label">fat</span>
          </div>
        </div>
        
        <button 
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          title="Edit product"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
