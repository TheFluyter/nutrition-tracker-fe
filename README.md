# Nutrition Tracker Frontend

A React TypeScript application that displays nutritional information for products.

## Features

- **Get Products Button**: Fetches products from the backend API
- **Product Cards**: Displays detailed nutrition facts in a clean, readable format
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Shows user-friendly error messages
- **Loading States**: Provides feedback during API calls

## Available Products

- **Banana**: Rich in potassium (358mg) and vitamin C (8.7mg)
- **Apple**: Good source of fiber (2.4g) and vitamin C (4.6mg)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend API running on port 8080

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend Integration

The frontend expects the backend API to be running on `http://localhost:8080` with the following endpoints:

- `GET /api/products` - Returns all products with nutrition facts
- `GET /api/products/{id}` - Returns a specific product by ID

## Project Structure

```
src/
├── components/
│   ├── ProductCard.tsx      # Product display component
│   └── ProductCard.css      # Product card styles
├── services/
│   └── api.ts              # API service for backend communication
├── types/
│   └── Product.ts          # TypeScript interfaces
├── App.tsx                 # Main application component
├── App.css                 # Global styles
└── index.tsx              # Application entry point
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with modern features

## API Response Format

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  nutritionFacts: {
    calories: number;
    protein: number;        // grams
    carbohydrates: number;  // grams
    fat: number;           // grams
    fiber: number;         // grams
    sugar: number;         // grams
    sodium: number;        // milligrams
    vitaminC: number;      // milligrams
    potassium: number;     // milligrams
  };
}
```