import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { searchProducts, updateFilters, clearFilters } from '../store/slices/arbitrageSlice';

// Mock data for initial display
const mockCategories = [
  'All Categories', 'Electronics', 'Clothing', 'Shoes', 'Toys', 'Games', 'Books', 'Groceries'
];

const mockMarketplaces = [
  'All Marketplaces', 'Amazon', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Etsy', 'Facebook Marketplace'
];

// Mock products for demo
const mockProducts = [
  {
    id: '1',
    productName: 'Sony WH-1000XM4 Wireless Headphones',
    sourceMarketplace: 'Amazon',
    sourcePrice: 248.00,
    targetMarketplace: 'eBay',
    targetPrice: 329.99,
    profit: 81.99,
    profitPercentage: 33.06,
    category: 'Electronics',
    imageUrl: 'https://example.com/headphones.jpg',
    sourceUrl: 'https://amazon.com/product1',
    targetUrl: 'https://ebay.com/product1',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    productName: 'Nike Air Jordan 1 Retro High',
    sourceMarketplace: 'Nike',
    sourcePrice: 170.00,
    targetMarketplace: 'StockX',
    targetPrice: 250.00,
    profit: 80.00,
    profitPercentage: 47.06,
    category: 'Shoes',
    imageUrl: 'https://example.com/shoes.jpg',
    sourceUrl: 'https://nike.com/product1',
    targetUrl: 'https://stockx.com/product1',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    productName: 'PlayStation 5 Digital Edition',
    sourceMarketplace: 'Target',
    sourcePrice: 399.99,
    targetMarketplace: 'Facebook Marketplace',
    targetPrice: 550.00,
    profit: 150.01,
    profitPercentage: 37.50,
    category: 'Electronics',
    imageUrl: 'https://example.com/ps5.jpg',
    sourceUrl: 'https://target.com/product1',
    targetUrl: 'https://facebook.com/marketplace/product1',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    productName: 'Lego Star Wars Millennium Falcon',
    sourceMarketplace: 'Walmart',
    sourcePrice: 128.00,
    targetMarketplace: 'Amazon',
    targetPrice: 169.99,
    profit: 41.99,
    profitPercentage: 32.80,
    category: 'Toys',
    imageUrl: 'https://example.com/lego.jpg',
    sourceUrl: 'https://walmart.com/product1',
    targetUrl: 'https://amazon.com/product1',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    productName: 'Apple AirPods Pro',
    sourceMarketplace: 'Best Buy',
    sourcePrice: 179.99,
    targetMarketplace: 'eBay',
    targetPrice: 219.99,
    profit: 40.00,
    profitPercentage: 22.22,
    category: 'Electronics',
    imageUrl: 'https://example.com/airpods.jpg',
    sourceUrl: 'https://bestbuy.com/product1',
    targetUrl: 'https://ebay.com/product1',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    productName: 'Instant Pot Duo 7-in-1',
    sourceMarketplace: 'Target',
    sourcePrice: 79.99,
    targetMarketplace: 'Amazon',
    targetPrice: 99.95,
    profit: 19.96,
    profitPercentage: 24.95,
    category: 'Home & Kitchen',
    imageUrl: 'https://example.com/instantpot.jpg',
    sourceUrl: 'https://target.com/product2',
    targetUrl: 'https://amazon.com/product2',
    lastUpdated: new Date().toISOString()
  }
];

const ProductSearch: React.FC = () => {
  const dispatch = useDispatch();
  const { opportunities, filteredOpportunities, isLoading, error, filters } = useSelector((state: RootState) => state.arbitrage);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [sourceMarketplace, setSourceMarketplace] = useState('');
  const [targetMarketplace, setTargetMarketplace] = useState('');
  const [profitRange, setProfitRange] = useState<[number, number]>([0, 200]);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [sortBy, setSortBy] = useState('profit');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // For demo purposes, use mock data
  const [displayProducts, setDisplayProducts] = useState(mockProducts);
  
  useEffect(() => {
    // In a real app, this would fetch from the API
    // dispatch(fetchArbitrageOpportunities());
  }, [dispatch]);
  
  const handleSearch = () => {
    // In a real app, this would search via API
    // dispatch(searchProducts(searchQuery));
    
    // For demo, filter the mock products
    const filtered = mockProducts.filter(product => 
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayProducts(filtered);
  };
  
  const handleApplyFilters = () => {
    // In a real app, this would update filters in Redux
    // dispatch(updateFilters({
    //   category,
    //   sourceMarketplace,
    //   targetMarketplace,
    //   minProfit: profitRange[0],
    //   maxProfit: profitRange[1],
    //   minProfitPercentage: profitPercentage,
    //   sortBy: sortBy as 'profit' | 'profitPercentage' | 'lastUpdated',
    //   sortOrder: sortOrder as 'asc' | 'desc'
    // }));
    
    // For demo, filter the mock products
    let filtered = [...mockProducts];
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (sourceMarketplace && sourceMarketplace !== 'All Marketplaces') {
      filtered = filtered.filter(product => product.sourceMarketplace === sourceMarketplace);
    }
    
    if (targetMarketplace && targetMarketplace !== 'All Marketplaces') {
      filtered = filtered.filter(product => product.targetMarketplace === targetMarketplace);
    }
    
    filtered = filtered.filter(product => 
      product.profit >= profitRange[0] && 
      product.profit <= profitRange[1] &&
      product.profitPercentage >= profitPercentage
    );
    
    // Apply sorting
    filtered.sort((a, b) => {
      const sortMultiplier = sortOrder === 'asc' ? 1 : -1;
      
      if (sortBy === 'profit') {
        return (a.profit - b.profit) * sortMultiplier;
      } else if (sortBy === 'profitPercentage') {
        return (a.profitPercentage - b.profitPercentage) * sortMultiplier;
      } else {
        return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * sortMultiplier;
      }
    });
    
    setDisplayProducts(filtered);
  };
  
  const handleResetFilters = () => {
    // In a real app, this would clear filters in Redux
    // dispatch(clearFilters());
    
    setCategory('');
    setSourceMarketplace('');
    setTargetMarketplace('');
    setProfitRange([0, 200]);
    setProfitPercentage(0);
    setSortBy('profit');
    setSortOrder('desc');
    setDisplayProducts(mockProducts);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Product Search
      </Typography>
      
      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
        
        {/* Filters Section */}
        {showFilters && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Filter Options
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {mockCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Source Marketplace</InputLabel>
                  <Select
                    value={sourceMarketplace}
                    label="Source Marketplace"
                    onChange={(e) => setSourceMarketplace(e.target.value)}
                  >
                    {mockMarketplaces.map((market) => (
                      <MenuItem key={market} value={market}>{market}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Target Marketplace</InputLabel>
                  <Select
                    value={targetMarketplace}
                    label="Target Marketplace"
                    onChange={(e) => setTargetMarketplace(e.target.value)}
                  >
                    {mockMarketplaces.map((market) => (
                      <MenuItem key={market} value={market}>{market}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Profit Range: ${profitRange[0]} - ${profitRange[1]}
                </Typography>
                <Slider
                  value={profitRange}
                  onChange={(e, newValue) => setProfitRange(newValue as [number, number])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Minimum Profit Percentage: {profitPercentage}%
                </Typography>
                <Slider
                  value={profitPercentage}
                  onChange={(e, newValue) => setProfitPercentage(newValue as number)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="profit">Profit Amount</MenuItem>
                    <MenuItem value="profitPercentage">Profit Percentage</MenuItem>
                    <MenuItem value="lastUpdated">Last Updated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Sort Order"
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <MenuItem value="desc">Highest First</MenuItem>
                    <MenuItem value="asc">Lowest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                  <Button variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* Results Section */}
      <Box>
        <Typography variant="h6" gutterBottom>
          {displayProducts.length} Results Found
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {displayProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                      {product.productName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`${product.profitPercentage.toFixed(1)}%`} 
                        size="small" 
                        color="secondary" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Buy from: {product.sourceMarketplace} at ${product.sourcePrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sell on: {product.targetMarketplace} at ${product.targetPrice.toFixed(2)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Typography variant="h5" color="secondary">
                        ${product.profit.toFixed(2)} Profit
                      </Typography>
                    </Box>
                  </CardContent><response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>