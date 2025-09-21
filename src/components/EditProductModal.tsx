import React, { useState, useEffect } from 'react';
import { Product, NutritionFacts } from '../types/Product';
import { productApi } from '../services/api';
import './EditProductModal.css';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (product: Product) => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onProductUpdated, 
  product 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    nutritionFacts: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      vitaminC: 0,
      potassium: 0
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form with product data when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        description: product.description,
        nutritionFacts: { ...product.nutritionFacts }
      });
      setError(null);
    }
  }, [product, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('nutritionFacts.')) {
      const nutritionField = name.split('.')[1] as keyof NutritionFacts;
      setFormData(prev => ({
        ...prev,
        nutritionFacts: {
          ...prev.nutritionFacts,
          [nutritionField]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedProduct = await productApi.updateProduct(product.id, formData);
      onProductUpdated(updatedProduct);
      onClose();
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="nutrition-section">
            <h3>Nutrition Facts (per 100g)</h3>
            <div className="nutrition-grid">
              <div className="form-group">
                <label htmlFor="calories">Calories</label>
                <input
                  type="number"
                  id="calories"
                  name="nutritionFacts.calories"
                  value={formData.nutritionFacts.calories}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="nutritionFacts.protein"
                  value={formData.nutritionFacts.protein}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbohydrates">Carbohydrates (g)</label>
                <input
                  type="number"
                  id="carbohydrates"
                  name="nutritionFacts.carbohydrates"
                  value={formData.nutritionFacts.carbohydrates}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fat">Fat (g)</label>
                <input
                  type="number"
                  id="fat"
                  name="nutritionFacts.fat"
                  value={formData.nutritionFacts.fat}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="fiber"
                  name="nutritionFacts.fiber"
                  value={formData.nutritionFacts.fiber}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sugar">Sugar (g)</label>
                <input
                  type="number"
                  id="sugar"
                  name="nutritionFacts.sugar"
                  value={formData.nutritionFacts.sugar}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sodium">Sodium (mg)</label>
                <input
                  type="number"
                  id="sodium"
                  name="nutritionFacts.sodium"
                  value={formData.nutritionFacts.sodium}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vitaminC">Vitamin C (mg)</label>
                <input
                  type="number"
                  id="vitaminC"
                  name="nutritionFacts.vitaminC"
                  value={formData.nutritionFacts.vitaminC}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="potassium">Potassium (mg)</label>
                <input
                  type="number"
                  id="potassium"
                  name="nutritionFacts.potassium"
                  value={formData.nutritionFacts.potassium}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
