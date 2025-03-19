import React, { useState } from 'react';
import axios from 'axios';

// Webscraping service for frontend
const useWebscrapingService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scrape product data from URL
  const scrapeProductData = async (url) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call the backend API
      // const response = await axios.post('/api/webscraping/scrape', { url });

      // For demo purposes, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate response based on URL
      const marketplace = url.includes('amazon') ? 'amazon' :
        url.includes('ebay') ? 'ebay' :
        url.includes('walmart') ? 'walmart' :
        url.includes('bestbuy') ? 'bestbuy' :
        url.includes('target') ? 'target' : 'unknown';

      const mockProducts = {
        amazon: {
          name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
          price: 248.00,
          currency: 'USD',
          availability: 'In Stock',
          rating: 4.7,
          reviews: 28456,
          description: 'Industry-leading noise cancellation with Dual Noise Sensor technology',
          imageUrl: 'https://example.com/sony-headphones.jpg',
          category: 'Electronics',
          brand: 'Sony',
          features: [
            'Industry-leading noise cancellation',
            'Up to 30-hour battery life',
            'Touch controls',
            'Speak-to-chat technology'
          ]
        },
        ebay: {
          name: 'Sony WH-1000XM4 Wireless Headphones - Black - Excellent Condition',
          price: 329.99,
          currency: 'USD',
          availability: 'Available',
          rating: 4.9,
          reviews: 156,
          description: 'Excellent condition Sony WH-1000XM4 wireless headphones with all accessories',
          imageUrl: 'https://example.com/sony-headphones-ebay.jpg',
          category: 'Electronics',
          brand: 'Sony',
          features: [
            'Like new condition',
            'Original packaging',
            'All accessories included',
            '30-day returns accepted'
          ]
        },
        walmart: {
          name: 'Sony WH-1000XM4 Wireless Noise-Canceling Overhead Headphones',
          price: 269.99,
          currency: 'USD',
          availability: 'In Stock',
          rating: 4.6,
          reviews: 1245,
          description: 'Premium wireless headphones with industry-leading noise cancellation',
          imageUrl: 'https://example.com/sony-headphones-walmart.jpg',
          category: 'Electronics',
          brand: 'Sony',
          features: [
            'Noise cancellation',
            'Long battery life',
            'Touch controls',
            'Voice assistant compatible'
          ]
        },
        bestbuy: {
          name: 'Sony - WH-1000XM4 Wireless Noise-Cancelling Over-the-Ear Headphones - Black',
          price: 279.99,
          currency: 'USD',
          availability: 'In Stock',
          rating: 4.8,
          reviews: 9876,
          description: 'Sony WH-1000XM4 wireless headphones deliver premium sound quality and industry-leading noise cancellation',
          imageUrl: 'https://example.com/sony-headphones-bestbuy.jpg',
          category: 'Electronics',
          brand: 'Sony',
          features: [
            'Adaptive sound control',
            'Speak-to-chat technology',
            'Wearing detection',
            'Multipoint connection'
          ]
        },
        target: {
          name: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
          price: 299.99,
          currency: 'USD',
          availability: 'In Stock',
          rating: 4.7,
          reviews: 567,
          description: 'Experience premium sound quality and industry-leading noise cancellation',
          imageUrl: 'https://example.com/sony-headphones-target.jpg',
          category: 'Electronics',
          brand: 'Sony',
          features: [
            'Noise cancellation',
            'Long battery life',
            'Touch controls',
            'Voice assistant compatible'
          ]
        },
        unknown: {
          name: 'Wireless Headphones',
          price: 249.99,
          currency: 'USD',
          availability: 'Unknown',
          rating: 4.5,
          reviews: 100,
          description: 'Wireless headphones with noise cancellation',
          imageUrl: 'https://example.com/headphones.jpg',
          category: 'Electronics',
          brand: 'Unknown',
          features: [
            'Wireless connectivity',
            'Noise cancellation',
            'Long battery life'
          ]
        }
      };

      const result = {
        success: true,
        data: mockProducts[marketplace],
        source: marketplace,
        url
      };

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Error scraping product data:', error);
      setError('Failed to scrape product data. Please try again.');
      setIsLoading(false);
      return {
        success: false,
        error: error.message,
        url
      };
    }
  };

  // Search products across marketplaces
  const searchProducts = async (query, marketplaces = ['amazon', 'ebay', 'walmart', 'bestbuy', 'target']) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call the backend API
      // const response = await axios.get(`/api/webscraping/search?query=${query}&marketplaces=${marketplaces.join(',')}`);

      // For demo purposes, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate response based on query
      const mockSearchResults = {
        amazon: [
          {
            name: 'Sony WH-1000XM4 Wireless Noise-Canceling Headphones',
            price: 248.00,
            url: 'https://amazon.com/sony-wh1000xm4',
            imageUrl: 'https://example.com/sony-headphones.jpg'
          },
          {
            name: 'Bose QuietComfort 45 Bluetooth Wireless Headphones',
            price: 279.00,
            url: 'https://amazon.com/bose-qc45',
            imageUrl: 'https://example.com/bose-headphones.jpg'
          }
        ],
        ebay: [
          {
            name: 'Sony WH-1000XM4 Wireless Headphones - Black - Excellent Condition',
            price: 329.99,
            url: 'https://ebay.com/sony-wh1000xm4',
            imageUrl: 'https://example.com/sony-headphones-ebay.jpg'
          },
          {
            name: 'Bose QuietComfort 45 Wireless Noise Cancelling Headphones - White',
            price: 299.99,
            url: 'https://ebay.com/bose-qc45',
            imageUrl: 'https://example.com/bose-headphones-ebay.jpg'
          }
        ],
        walmart: [
          {
            name: 'Sony WH-1000XM4 Wireless Noise-Canceling Overhead Headphones',
            price: 269.99,
            url: 'https://walmart.com/sony-wh1000xm4',
            imageUrl: 'https://example.com/sony-headphones-walmart.jpg'
          }
        ],
        bestbuy: [
          {
            name: 'Sony - WH-1000XM4 Wireless Noise-Cancelling Over-the-Ear Headphones - Black',
            price: 279.99,
            url: 'https://bestbuy.com/sony-wh1000xm4',
            imageUrl: 'https://example.com/sony-headphones-bestbuy.jpg'
          }
        ],
        target: [
          {
            name: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
            price: 299.99,
            url: 'https://target.com/sony-wh1000xm4',
            imageUrl: 'https://example.com/sony-headphones-target.jpg'
          }
        ]
      };

      // Filter results based on query
      const results = [];

      marketplaces.forEach(marketplace => {
        if (mockSearchResults[marketplace]) {
          const filteredResults = mockSearchResults[marketplace].filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
          );

          filteredResults.forEach(product => {
            results.push({
              ...product,
              marketplace
            });
          });
        }
      });

      const result = {
        success: true,
        count: results.length,
        data: results
      };

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Failed to search products. Please try again.');
      setIsLoading(false);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Compare prices for a product
  const comparePrices = async (productName) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real implementation, this would call the backend API
      // const response = await axios.get(`/api/webscraping/compare?product=${encodeURIComponent(productName)}`);

      // For demo purposes, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate response based on product name
      const mockPriceComparison = {
        'sony wh-1000xm4': {
          amazon: 248.00,
          bestbuy: 279.99,
          walmart: 269.99,
          ebay: 329.99,
          target: 299.99
        },
        'bose quietcomfort 45': {
          amazon: 279.00,
          bestbuy: 299.99,
          walmart: 289.99,
          ebay: 299.99,
          target: 329.99
        },
        'apple airpods pro': {
          amazon: 179.99,
          bestbuy: 199.99,
          walmart: 189.99,
          ebay: 219.99,
          target: 194.99
        }
      };

      // Find the closest match
      const productKey = Object.keys(mockPriceComparison).find(key =>
        key.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(key.toLowerCase())
      );

      if (!productKey) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Product not found'
        };
      }

      const priceData = mockPriceComparison[productKey];

      // Find the best deals
      const marketplaces = Object.keys(priceData);
      const prices = Object.values(priceData);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      const bestDeal = {
        marketplace: marketplaces[prices.indexOf(minPrice)],
        price: minPrice
      };

      const worstDeal = {
        marketplace: marketplaces[prices.indexOf(maxPrice)],
        price: maxPrice
      };

      const potentialProfit = maxPrice - minPrice;
      const profitPercentage = (potentialProfit / minPrice) * 100;

      const result = {
        success: true,
        productName,
        prices: priceData,
        bestDeal,
        worstDeal,
        potentialProfit,
        profitPercentage,
        arbitrageViable: profitPercentage >= 10 && potentialProfit >= 20
      };

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Error comparing prices:', error);
      setError('Failed to compare prices. Please try again.');
      setIsLoading(false);
      return {
        success: false,
        error: error.message
      };
    }
  };

  return {
    isLoading,
    error,
    scrapeProductData,
    searchProducts,
    comparePrices
  };
};

export default useWebscrapingService;