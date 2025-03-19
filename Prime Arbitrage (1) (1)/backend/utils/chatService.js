// Chat service using Groq API
const axios = require('axios');

// Groq API key
const GROQ_API_KEY = 'gsk_oG8WGEI8fZZGnKjReJA2WGdyb3FYgQYeTjd8VtIpK2YWiOLXOph';

/**
 * Send a message to the Groq API and get a response
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise<Object>} Chat response
 */
const sendMessage = async (message, history = []) => {
  try {
    // In a real implementation, this would call the Groq API
    // For demo purposes, we'll simulate the API response

    // Format the conversation history for the API
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Add the current message
    formattedHistory.push({
      role: 'user',
      content: message
    });

    // In a real implementation, this would be the API call:
    /*
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: formattedHistory,
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const assistantResponse = response.data.choices[0].message.content;
    */

    // Simulate API response based on the message content
    let assistantResponse = '';

    if (message.toLowerCase().includes('arbitrage')) {
      assistantResponse = 'Arbitrage is the practice of taking advantage of price differences between markets. Our platform helps you identify these opportunities across various product categories. You can use the Product Search feature to find specific products or browse the Dashboard for top opportunities.';
    } else if (message.toLowerCase().includes('price') || message.toLowerCase().includes('pricing')) {
      assistantResponse = 'Our platform collects real-time pricing data from multiple marketplaces to identify the best arbitrage opportunities. We update this information regularly to ensure you have the most accurate data. Premium users get access to real-time updates, while free users receive daily updates.';
    } else if (message.toLowerCase().includes('marketplace') || message.toLowerCase().includes('marketplaces')) {
      assistantResponse = 'We support multiple marketplaces including Amazon, eBay, Walmart, Target, Best Buy, and more. You can filter opportunities by source and target marketplaces in the Product Search section. Premium users have access to all marketplaces, while free users have limited marketplace access.';
    } else if (message.toLowerCase().includes('subscription') || message.toLowerCase().includes('premium')) {
      assistantResponse = 'Our Premium subscription is $9.99/month and provides access to all product categories, real-time updates, advanced analytics, and priority support. You can upgrade in the Subscription section. Free users have access to basic features with limitations on the number of opportunities and marketplaces.';
    } else if (message.toLowerCase().includes('how') && message.toLowerCase().includes('work')) {
      assistantResponse = 'Our platform works by scanning multiple marketplaces for price differences on the same products. When we find a product that\'s selling for a higher price on one marketplace compared to another, we identify it as an arbitrage opportunity. You can then purchase the product from the cheaper source and sell it on the more expensive marketplace for a profit.';
    } else if (message.toLowerCase().includes('help')) {
      assistantResponse = 'I can help you with finding arbitrage opportunities, understanding pricing data, navigating marketplaces, managing your inventory, and optimizing your selling strategy. Just let me know what specific assistance you need!';
    } else {
      assistantResponse = 'I\'m here to help with your arbitrage needs. You can ask me about finding products, pricing strategies, marketplace integration, or any other questions related to arbitrage opportunities. Is there something specific you\'d like to know about our platform?';
    }

    return {
      success: true,
      message: assistantResponse,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending message to Groq API:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendMessage
};