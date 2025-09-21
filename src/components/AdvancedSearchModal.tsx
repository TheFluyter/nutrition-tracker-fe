import React from 'react';
import './AdvancedSearchModal.css';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: () => void;
  minProtein: string;
  setMinProtein: (value: string) => void;
  maxProtein: string;
  setMaxProtein: (value: string) => void;
  loading: boolean;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  minProtein,
  setMinProtein,
  maxProtein,
  setMaxProtein,
  loading
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content advanced-search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Advanced Search</h2>
              <button
                className="modal-close-button"
                onClick={onClose}
                disabled={loading}
                title="Close modal"
              >
                ×
              </button>
            </div>
        
        <form onSubmit={handleSubmit} className="advanced-search-form">
          <div className="search-section">
            <h3 className="section-title">Protein Range Filter</h3>
            <p className="section-description">
              Filter products by protein content (grams per 100g)
            </p>
            
            <div className="protein-range-group">
              <div className="range-inputs">
                <div className="input-group">
                  <label htmlFor="minProtein" className="input-label">Minimum Protein (g)</label>
                  <input
                    type="number"
                    id="minProtein"
                    className="range-input"
                    placeholder="0"
                    value={minProtein}
                    onChange={(e) => setMinProtein(e.target.value)}
                    disabled={loading}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div className="range-separator">
                  <span>to</span>
                </div>
                
                <div className="input-group">
                  <label htmlFor="maxProtein" className="input-label">Maximum Protein (g)</label>
                  <input
                    type="number"
                    id="maxProtein"
                    className="range-input"
                    placeholder="100"
                    value={maxProtein}
                    onChange={(e) => setMaxProtein(e.target.value)}
                    disabled={loading}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="search-actions">
                <button 
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="search-button"
                  disabled={loading || (!minProtein && !maxProtein)}
                >
                  {loading ? 'Searching...' : 'Search by Protein Range'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
