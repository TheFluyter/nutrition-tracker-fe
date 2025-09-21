import React, { useState } from 'react';
import { Product } from './types/Product';
import { productApi } from './services/api';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'calories' | 'protein' | 'carbohydrates' | 'fat'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleGetProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedProducts = await productApi.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products. Make sure the backend is running on port 8080.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchProducts = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchedProducts = await productApi.searchProducts(searchTerm);
      setProducts(searchedProducts);
    } catch (err) {
      setError('Failed to search products. Make sure the backend is running on port 8080.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchProducts();
    }
  };

  const handleProductAdded = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct].sort((a, b) => a.name.localeCompare(b.name)));
    setError(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setViewingProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts
        .map(p => p.id === updatedProduct.id ? updatedProduct : p)
        .sort(sortProducts)
    );
    setError(null);
  };

  const sortProducts = (a: Product, b: Product): number => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'calories':
        comparison = a.nutritionFacts.calories - b.nutritionFacts.calories;
        break;
      case 'protein':
        comparison = a.nutritionFacts.protein - b.nutritionFacts.protein;
        break;
      case 'carbohydrates':
        comparison = a.nutritionFacts.carbohydrates - b.nutritionFacts.carbohydrates;
        break;
      case 'fat':
        comparison = a.nutritionFacts.fat - b.nutritionFacts.fat;
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  };

  const handleSort = (criteria: 'name' | 'calories' | 'protein' | 'carbohydrates' | 'fat') => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort(sortProducts);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Nutrition Tracker</h1>
        <p className="App-subtitle">Discover the nutritional value of your favorite foods</p>
        
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="search-btn"
              onClick={handleSearchProducts}
              disabled={loading || !searchTerm.trim()}
            >
              Search
            </button>
          </div>
          
          <div className="action-buttons">
            <button 
              className="add-product-btn"
              onClick={() => setIsAddModalOpen(true)}
              disabled={loading}
            >
              + Add Product
            </button>
            
            <button 
              className="get-products-btn"
              onClick={handleGetProducts}
              disabled={loading}
            >
              Get All Products
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </header>
      
      <main className="App-main">
        {sortedProducts.length > 0 && (
          <div className="products-container">
            <div className="products-header">
              <h2 className="products-title">Available Products</h2>
              <div className="sort-controls">
                <span className="sort-label">Sort by:</span>
                <div className="sort-buttons">
                  <button 
                    className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'calories' ? 'active' : ''}`}
                    onClick={() => handleSort('calories')}
                  >
                    Calories {sortBy === 'calories' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'protein' ? 'active' : ''}`}
                    onClick={() => handleSort('protein')}
                  >
                    Protein {sortBy === 'protein' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'carbohydrates' ? 'active' : ''}`}
                    onClick={() => handleSort('carbohydrates')}
                  >
                    Carbs {sortBy === 'carbohydrates' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'fat' ? 'active' : ''}`}
                    onClick={() => handleSort('fat')}
                  >
                    Fat {sortBy === 'fat' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={handleEditProduct}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onProductUpdated={handleProductUpdated}
        product={editingProduct}
      />

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
      />
    </div>
  );
}

export default App;
