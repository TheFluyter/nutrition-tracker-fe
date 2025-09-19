import React, { useState } from 'react';
import { Product } from './types/Product';
import { productApi } from './services/api';
import ProductCard from './components/ProductCard';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          
          <button 
            className="get-products-btn"
            onClick={handleGetProducts}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get All Products'}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </header>
      
      <main className="App-main">
        {products.length > 0 && (
          <div className="products-container">
            <h2 className="products-title">Available Products</h2>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
