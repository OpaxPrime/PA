// Arbitrage detection service
const axios = require('axios');
const cheerio = require('cheerio');

// Mock product data for demonstration
const mockProducts = {
  electronics: [
    {
      id: '1',
      name: 'Sony WH-1000XM4 Wireless Headphones',
      prices: {
        amazon: 248.00,
        bestbuy: 279.99,
        walmart: 269.99,
        ebay: 329.99,
        target: 299.99
      },
      category: 'Electronics',
      imageUrl: 'https://example.com/headphones.jpg'
    },
    {
      id: '2',
      name: 'Apple AirPods Pro',
      prices: {
        amazon: 179.99,
        bestbuy: 199.99,
        walmart: 189.99,
        ebay: 219.99,
        target: 194.99
      },
      category: 'Electronics',
      imageUrl: 'https://example.com/airpods.jpg'
    },
    {
      id: '3',
      name: 'PlayStation 5 Digital Edition',
      prices: {
        amazon: 399.99,
        bestbuy: 399.99,
        walmart: 389.99,
        ebay: 550.00,
        target: 399.99
      },
      category: 'Electronics',
      imageUrl: 'https://example.com/ps5.jpg'
    }
  ],
  clothing: [
    {
      id: '4',
      name: 'Nike Air Jordan 1 Retro High',
      prices: {
        nike: 170.00,
        footlocker: 180.00,
        stockx: 250.00,
        ebay: 230.00,
        amazon: 210.00
      },
      category: 'Shoes',
      imageUrl: 'https://example.com/shoes.jpg'
    }
  ],
  toys: [
    {
      id: '5',
      name: 'Lego Star Wars Millennium Falcon',
      prices: {
        amazon: 128.00,
        walmart: 139.99,
        target: 149.99,
        ebay: 169.99,
        lego: 159.99
      },
      category: 'Toys',
      imageUrl: 'https://example.com/lego.jpg'
    }
  ],
  home: [
    {
      id: '6',
      name: 'Instant Pot Duo 7-in-1',
      prices: {
        amazon: 89.99,
        walmart: 79.99,
        target: 99.95,
        bestbuy: 89.99,
        ebay: 109.99
      },
      category: 'Home & Kitchen',
      imageUrl: 'https://example.com/instantpot.jpg'
    }
  ]
};

/**
 * Find arbitrage opportunities across marketplaces
 * @param {string} category - Product category to search
 * @param {number} minProfitMargin - Minimum profit margin percentage
 * @param {number} minProfit - Minimum profit amount
 * @returns {Array} Array of arbitrage opportunities
 */
const findArbitrageOpportunities = (category = 'all', minProfitMargin = 10, minProfit = 20) => {
  const opportunities = [];

  // Determine which categories to search
  const categoriesToSearch = category === 'all' ?
    Object.keys(mockProducts) :
    [category];

  // Search each category
  categoriesToSearch.forEach(cat => {
    if (!mockProducts[cat]) return;

    mockProducts[cat].forEach(product => {
      const prices = product.prices;
      const marketplaces = Object.keys(prices);

      // Compare each marketplace with every other marketplace
      for (let i = 0; i < marketplaces.length; i++) {
        const sourceMarketplace = marketplaces[i];
        const sourcePrice = prices[sourceMarketplace];

        for (let j = 0; j < marketplaces.length; j++) {
          if (i === j) continue; // Skip same marketplace

          const targetMarketplace = marketplaces[j];
          const targetPrice = prices[targetMarketplace];

          // Calculate profit and profit margin
          const profit = targetPrice - sourcePrice;
          const profitMargin = (profit / sourcePrice) * 100;

          // Check if this is a viable arbitrage opportunity
          if (profit > minProfit && profitMargin > minProfitMargin) {
            opportunities.push({
              id: `${product.id}-${sourceMarketplace}-${targetMarketplace}`,
              productName: product.name,
              productId: product.id,
              sourceMarketplace,
              sourcePrice,
              targetMarketplace,
              targetPrice,
              profit,
              profitPercentage: profitMargin,
              category: product.category,
              imageUrl: product.imageUrl,
              sourceUrl: `https://${sourceMarketplace}.com/product/${product.id}`,
              targetUrl: `https://${targetMarketplace}.com/product/${product.id}`,
              lastUpdated: new Date().toISOString()
            });
          }
        }
      }
    });
  });

  // Sort opportunities by profit (highest first)
  return opportunities.sort((a, b) => b.profit - a.profit);
};

/**
 * Search for products by name
 * @param {string} query - Search query
 * @returns {Array} Array of matching products
 */
const searchProducts = (query) => {
  const results = [];

  // Search each category
  Object.keys(mockProducts).forEach(category => {
    mockProducts[category].forEach(product => {
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(product);
      }
    });
  });

  return results;
};

/**
 * Get product details by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} Product details or null if not found
 */
const getProductById = (productId) => {
  let foundProduct = null;

  // Search each category
  Object.keys(mockProducts).forEach(category => {
    const product = mockProducts[category].find(p => p.id === productId);
    if (product) {
      foundProduct = product;
    }
  });

  return foundProduct;
};

/**
 * Get arbitrage opportunities for a specific product
 * @param {string} productId - Product ID
 * @param {number} minProfitMargin - Minimum profit margin percentage
 * @param {number} minProfit - Minimum profit amount
 * @returns {Array} Array of arbitrage opportunities
 */
const getProductArbitrageOpportunities = (productId, minProfitMargin = 10, minProfit = 20) => {
  const product = getProductById(productId);
  if (!product) return [];

  const opportunities = [];
  const prices = product.prices;
  const marketplaces = Object.keys(prices);

  // Compare each marketplace with every other marketplace
  for (let i = 0; i < marketplaces.length; i++) {
    const sourceMarketplace = marketplaces[i];
    const sourcePrice = prices[sourceMarketplace];

    for (let j = 0; j < marketplaces.length; j++) {
      if (i === j) continue; // Skip same marketplace

      const targetMarketplace = marketplaces[j];
      const targetPrice = prices[targetMarketplace];

      // Calculate profit and profit margin
      const profit = targetPrice - sourcePrice;
      const profitMargin = (profit / sourcePrice) * 100;

      // Check if this is a viable arbitrage opportunity
      if (profit > minProfit && profitMargin > minProfitMargin) {
        opportunities.push({
          id: `${product.id}-${sourceMarketplace}-${targetMarketplace}`,
          productName: product.name,
          productId: product.id,
          sourceMarketplace,
          sourcePrice,
          targetMarketplace,
          targetPrice,
          profit,
          profitPercentage: profitMargin,
          category: product.category,
          imageUrl: product.imageUrl,
          sourceUrl: `https://${sourceMarketplace}.com/product/${product.id}`,
          targetUrl: `https://${targetMarketplace}.com/product/${product.id}`,
          lastUpdated: new Date().toISOString()
        });
      }
    }
  }

  // Sort opportunities by profit (highest first)
  return opportunities.sort((a, b) => b.profit - a.profit);
};

/**
 * Get top arbitrage opportunities
 * @param {number} limit - Maximum number of opportunities to return
 * @returns {Array} Array of top arbitrage opportunities
 */
const getTopArbitrageOpportunities = (limit = 10) => {
  const allOpportunities = findArbitrageOpportunities();
  return allOpportunities.slice(0, limit);
};

/**
 * Filter arbitrage opportunities
 * @param {Object} filters - Filter criteria
 * @returns {Array} Array of filtered arbitrage opportunities
 */
const filterArbitrageOpportunities = (filters = {}) => {
  const {
    category = 'all',
      minProfit = 0,
      maxProfit = Infinity,
      minProfitPercentage = 0,
      sourceMarketplace = '',
      targetMarketplace = '',
      sortBy = 'profit',
      sortOrder = 'desc'
  } = filters;

  let opportunities = findArbitrageOpportunities(category, minProfitPercentage, minProfit);

  // Apply additional filters
  if (sourceMarketplace) {
    opportunities = opportunities.filter(opp => opp.sourceMarketplace === sourceMarketplace);
  }

  if (targetMarketplace) {
    opportunities = opportunities.filter(opp => opp.targetMarketplace === targetMarketplace);
  }

  if (maxProfit !== Infinity) {
    opportunities = opportunities.filter(opp => opp.profit <= maxProfit);
  }

  // Apply sorting
  opportunities.sort((a, b) => {
    const sortMultiplier = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'profit') {
      return (a.profit - b.profit) * sortMultiplier;
    } else if (sortBy === 'profitPercentage') {
      return (a.profitPercentage - b.profitPercentage) * sortMultiplier;
    } else {
      return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * sortMultiplier;
    }
  });

  return opportunities;
};

module.exports = {
  findArbitrageOpportunities,
  searchProducts,
  getProductById,
  getProductArbitrageOpportunities,
  getTopArbitrageOpportunities,
  filterArbitrageOpportunities
};