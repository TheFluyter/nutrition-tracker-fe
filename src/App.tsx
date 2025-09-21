import React, { useState } from 'react';
import { Product } from './types/Product';
import { productApi } from './services/api';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import ProductDetailsModal from './components/ProductDetailsModal';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import './App.css';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [maxProtein, setMaxProtein] = useState('');
  const [isAdvancedSearchModalOpen, setIsAdvancedSearchModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'calories' | 'protein' | 'carbohydrates' | 'fat'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<{
    searchTerm?: string;
    proteinRange?: { min: number; max: number };
  }>({});

  const handleGetProducts = async () => {
    setLoading(true);
    setError(null);
    setActiveFilters({}); // Clear all filters when getting all products
    
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

    // Create updated filters with the new search term
    const updatedFilters = { ...activeFilters, searchTerm: searchTerm.trim() };
    
    // Update active filters state
    setActiveFilters(updatedFilters);
    
    // Apply all filters with the updated filters
    await applyAllFilters(updatedFilters);
  };

  const applyAllFilters = async (filtersToApply?: typeof activeFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let filteredProducts: Product[] = [];
      
      // Use provided filters or current active filters
      const filters = filtersToApply || activeFilters;
      
      // Start with all products
      const allProducts = await productApi.getAllProducts();
      filteredProducts = allProducts;
      
      // Apply search filter if active
      if (filters.searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        );
      }
      
      // Apply protein range filter if active
      if (filters.proteinRange) {
        const { min, max } = filters.proteinRange;
        filteredProducts = filteredProducts.filter(product => 
          product.nutritionFacts.protein >= min && product.nutritionFacts.protein <= max
        );
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError('Failed to apply filters. Make sure the backend is running on port 8080.');
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProteinRangeSearch = async () => {
    if (!minProtein && !maxProtein) {
      setError('Please enter at least one protein value');
      return;
    }

    const min = minProtein ? parseFloat(minProtein) : 0;
    const max = maxProtein ? parseFloat(maxProtein) : 999999;
    
    // Create updated filters with the new protein range
    const updatedFilters = { ...activeFilters, proteinRange: { min, max } };
    
    // Update active filters state
    setActiveFilters(updatedFilters);
    
    // Close modal
    setIsAdvancedSearchModalOpen(false);
    
    // Apply all filters with the updated filters
    await applyAllFilters(updatedFilters);
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

  const removeFilter = async (filterType: 'searchTerm' | 'proteinRange') => {
    let updatedFilters = { ...activeFilters };
    
    if (filterType === 'searchTerm') {
      setSearchTerm('');
      delete updatedFilters.searchTerm;
    } else if (filterType === 'proteinRange') {
      setMinProtein('');
      setMaxProtein('');
      delete updatedFilters.proteinRange;
    }
    
    // Update active filters state
    setActiveFilters(updatedFilters);
    
    // Apply remaining filters after removing one
    await applyAllFilters(updatedFilters);
  };

  const clearAllFilters = async () => {
    setSearchTerm('');
    setMinProtein('');
    setMaxProtein('');
    setActiveFilters({});
    // Re-fetch all products when all filters are cleared
    await handleGetProducts();
  };

  const sortedProducts = [...products].sort(sortProducts);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Nutrition Tracker</h1>
        <p className="App-subtitle">Discover the nutritional value of your favorite foods</p>
        
            <div className="search-container">
              <div className="buttons-row">
                <div className="search-input-group">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search products by name..."
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
                  className="advanced-search-btn"
                  onClick={() => setIsAdvancedSearchModalOpen(true)}
                  disabled={loading}
                >
                  Advanced Search
                </button>
                
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
        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="active-filters-container">
            <div className="active-filters-header">
              <h3 className="active-filters-title">Active Filters</h3>
              <button 
                className="clear-all-filters-btn"
                onClick={clearAllFilters}
                disabled={loading}
              >
                Clear All
              </button>
            </div>
            <div className="active-filters-list">
              {activeFilters.searchTerm && (
                <div className="filter-chip">
                  <span className="filter-label">Search:</span>
                  <span className="filter-value">"{activeFilters.searchTerm}"</span>
                  <button 
                    className="remove-filter-btn"
                    onClick={() => removeFilter('searchTerm')}
                    disabled={loading}
                    title="Remove search filter"
                  >
                    ×
                  </button>
                </div>
              )}
              {activeFilters.proteinRange && (
                <div className="filter-chip">
                  <span className="filter-label">Protein:</span>
                  <span className="filter-value">
                    {activeFilters.proteinRange.min > 0 ? `${activeFilters.proteinRange.min}g` : '0g'} - {activeFilters.proteinRange.max < 999999 ? `${activeFilters.proteinRange.max}g` : '∞'}
                  </span>
                  <button 
                    className="remove-filter-btn"
                    onClick={() => removeFilter('proteinRange')}
                    disabled={loading}
                    title="Remove protein filter"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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

      <AdvancedSearchModal
        isOpen={isAdvancedSearchModalOpen}
        onClose={() => {
          setIsAdvancedSearchModalOpen(false);
          // Don't clear the protein values or remove the filter when modal is closed
          // The filter should persist until explicitly removed by the user
        }}
        onSearch={handleProteinRangeSearch}
        minProtein={minProtein}
        setMinProtein={setMinProtein}
        maxProtein={maxProtein}
        setMaxProtein={setMaxProtein}
        loading={loading}
      />
    </div>
  );
}

export default App;
