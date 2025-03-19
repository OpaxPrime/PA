import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LinkIcon from '@mui/icons-material/Link';
import useWebscrapingService from '../hooks/useWebscrapingService';

const WebscrapingTool = () => {
  const [urlInput, setUrlInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareProduct, setCompareProduct] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('scrape');
  
  const { isLoading, error, scrapeProductData, searchProducts, comparePrices } = useWebscrapingService();
  
  const handleScrape = async () => {
    if (!urlInput) return;
    
    const result = await scrapeProductData(urlInput);
    if (result.success) {
      setScrapedData(result);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery) return;
    
    const result = await searchProducts(searchQuery);
    if (result.success) {
      setSearchResults(result);
    }
  };
  
  const handleCompare = async () => {
    if (!compareProduct) return;
    
    const result = await comparePrices(compareProduct);
    if (result.success) {
      setPriceComparison(result);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Webscraping Tools
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Use these tools to scrape product data, search across marketplaces, and compare prices for arbitrage opportunities.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button 
            variant={activeTab === 'scrape' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('scrape')}
          >
            Scrape URL
          </Button>
          <Button 
            variant={activeTab === 'search' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('search')}
          >
            Search Products
          </Button>
          <Button 
            variant={activeTab === 'compare' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('compare')}
          >
            Compare Prices
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {activeTab === 'scrape' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Scrape Product Data
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product URL"
                  variant="outlined"
                  placeholder="https://amazon.com/product/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<LinkIcon />}
                  onClick={handleScrape}
                  disabled={isLoading || !urlInput}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Scrape Data'}
                </Button>
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {scrapedData && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Scraped Data from {scrapedData.source}
                </Typography>
                
                <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                  <CardMedia
                    component="div"
                    sx={{
                      width: { xs: '100%', md: 200 },
                      height: 200,
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Product Image
                    </Typography>
                  </CardMedia>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="h5" variant="h5">
                      {scrapedData.data.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {scrapedData.data.brand}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                        ${scrapedData.data.price.toFixed(2)}
                      </Typography>
                      <Chip 
                        label={scrapedData.data.availability} 
                        color={scrapedData.data.availability === 'In Stock' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {scrapedData.data.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Features:
                    </Typography>
                    <List dense>
                      {scrapedData.data.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0 }}>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        )}
        
        {activeTab === 'search' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Search Products Across Marketplaces
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product Search"
                  variant="outlined"
                  placeholder="Sony WH-1000XM4 headphones"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Search Products'}
                </Button>
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {searchResults && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {searchResults.count} Results Found
                </Typography>
                
                <Grid container spacing={3}>
                  {searchResults.data.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="div"
                          sx={{
                            height: 140,
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Product Image
                          </Typography>
                        </CardMedia>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div" noWrap>
                            {product.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Chip 
                              label={product.marketplace} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                            <Typography variant="h6" color="secondary">
                              ${product.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button size="small" href={product.url} target="_blank">
                            View Product
                          </Button>
                          <Button 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 'auto' }}
                            onClick={() => {
                              setCompareProduct(product.name);
                              setActiveTab('compare');
                            }}
                          >
                            Compare Prices
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
        
        {activeTab === 'compare' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Compare Prices Across Marketplaces
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product Name"
                  variant="outlined"
                  placeholder="Sony WH-1000XM4 headphones"
                  value={compareProduct}
                  onChange={(e) => setCompareProduct(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<CompareArrowsIcon />}
                  onClick={handleCompare}
                  disabled={isLoading || !compareProduct}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Compare Prices'}
                </Button>
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {priceComparison && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Price Comparison for {priceComparison.productName}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Prices by Marketplace
                        </Typography>
                        
                        <List>
                          {Object.entries(priceComparison.prices).map(([marketplace, price]) => (
                            <ListItem key={marketplace} divider>
                              <ListItemText 
                                primary={marketplace.charAt(0).toUpperCase() + marketplace.slice(1)} 
                                secondary={
                                  marketplace === priceComparison.bestDeal.marketplace 
                                    ? 'Best Deal!' 
                                    : marketplace === priceComparison.worstDeal.marketplace
                                    ? 'Highest Price'
                                    : ''
                                }
                              />
                              <Typography 
                                variant="h6" 
                                color={
                                  marketplace === priceComparison.bestDeal.marketplace 
                                    ? 'success.main' 
                                    : marketplace === priceComparison.worstDeal.marketplace
                                    ? 'error.main'
                                    : 'inherit'
                                }
                              >
                                ${price.toFixed(2)}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', bgcolor: priceComparison.arbitrageViable ? 'success.light' : 'warning.light' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Arbitrage Opportunity
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body1" gutterBottom>
                            Buy from: <strong>{priceComparison.bestDeal.marketplace}</strong> at <strong>${priceComparison.bestDeal.price.toFixed(2)}</strong>
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Sell on: <strong>{priceComparison.worstDeal.marketplace}</strong> at <strong>${priceComparison.worstDeal.price.toFixed(2)}</strong>
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h5" align="center" gutterBottom>
                          Potential Profit: ${priceComparison.potentialProfit.toFixed(2)}
                        </Typography>
                        <Typography variant="h6" align="center" gutterBottom>
                          Profit Margin: {priceComparison.profitPercentage.toFixed(1)}%
                        </Typography>
                        
                        <Alert severity={priceComparison.arbitrageViable ? 'success' : 'warning'} sx={{ mt: 2 }}>
           <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>