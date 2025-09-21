import React, { useState } from 'react';
import { Product, NutritionFacts } from '../types/Product';
import { productApi } from '../services/api';
import './AddProductModal.css';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
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
    setIsSubmitting(true);
    setError(null);

    try {
      const newProduct = await productApi.createProduct(formData);
      onProductAdded(newProduct);
      onClose();
      // Reset form
      setFormData({
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
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
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
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
