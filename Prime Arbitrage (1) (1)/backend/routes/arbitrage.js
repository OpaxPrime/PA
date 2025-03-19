const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const arbitrageDetection = require('../utils/arbitrageDetection');

// @desc    Get all arbitrage opportunities
// @route   GET /api/arbitrage/opportunities
// @access  Private
router.get('/opportunities', protect, (req, res) => {
  try {
    const {
      category,
      minProfit,
      maxProfit,
      minProfitPercentage,
      sourceMarketplace,
      targetMarketplace,
      sortBy,
      sortOrder
    } = req.query;

    // Apply filters based on query parameters
    const filters = {
      category: category || 'all',
      minProfit: minProfit ? parseFloat(minProfit) : 0,
      maxProfit: maxProfit ? parseFloat(maxProfit) : Infinity,
      minProfitPercentage: minProfitPercentage ? parseFloat(minProfitPercentage) : 0,
      sourceMarketplace: sourceMarketplace || '',
      targetMarketplace: targetMarketplace || '',
      sortBy: sortBy || 'profit',
      sortOrder: sortOrder || 'desc'
    };

    // Get filtered opportunities
    const opportunities = arbitrageDetection.filterArbitrageOpportunities(filters);

    // For premium users, return all opportunities
    // For free users, return limited opportunities
    const filteredOpportunities = req.user.subscription === 'premium' ?
      opportunities :
      opportunities.slice(0, 5);

    res.status(200).json({
      success: true,
      count: filteredOpportunities.length,
      data: filteredOpportunities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Search for products
// @route   GET /api/arbitrage/search
// @access  Private
router.get('/search', protect, (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    // Search for products
    const products = arbitrageDetection.searchProducts(query);

    // For each product, get arbitrage opportunities
    const results = products.map(product => {
      const opportunities = arbitrageDetection.getProductArbitrageOpportunities(product.id);
      const bestOpportunity = opportunities.length > 0 ? opportunities[0] : null;

      return {
        ...product,
        bestOpportunity
      };
    });

    // For premium users, return all results
    // For free users, return limited results
    const filteredResults = req.user.subscription === 'premium' ?
      results :
      results.slice(0, 3);

    res.status(200).json({
      success: true,
      count: filteredResults.length,
      data: filteredResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get top arbitrage opportunities
// @route   GET /api/arbitrage/top
// @access  Private
router.get('/top', protect, (req, res) => {
  try {
    const { limit } = req.query;
    const limitNumber = limit ? parseInt(limit) : 10;

    // Get top opportunities
    const opportunities = arbitrageDetection.getTopArbitrageOpportunities(limitNumber);

    // For premium users, return all top opportunities
    // For free users, return limited top opportunities
    const filteredOpportunities = req.user.subscription === 'premium' ?
      opportunities :
      opportunities.slice(0, 3);

    res.status(200).json({
      success: true,
      count: filteredOpportunities.length,
      data: filteredOpportunities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get arbitrage opportunity by ID
// @route   GET /api/arbitrage/opportunities/:id
// @access  Private
router.get('/opportunities/:id', protect, (req, res) => {
  try {
    const [productId, sourceMarketplace, targetMarketplace] = req.params.id.split('-');

    // Get product details
    const product = arbitrageDetection.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get all arbitrage opportunities for this product
    const opportunities = arbitrageDetection.getProductArbitrageOpportunities(productId);

    // Find the specific opportunity
    const opportunity = opportunities.find(opp =>
      opp.sourceMarketplace === sourceMarketplace &&
      opp.targetMarketplace === targetMarketplace
    );

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Arbitrage opportunity not found'
      });
    }

    // Check if free user is trying to access premium content
    if (req.user.subscription !== 'premium' && opportunities.indexOf(opportunity) >= 3) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required to access this opportunity'
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;