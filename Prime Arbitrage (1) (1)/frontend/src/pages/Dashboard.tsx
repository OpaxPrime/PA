import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchArbitrageOpportunities } from '../store/slices/arbitrageSlice';
import { fetchInventory } from '../store/slices/inventorySlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from 'react-router-dom';

// Mock data for initial display
const mockStats = {
  totalOpportunities: 156,
  highProfitOpportunities: 42,
  inventoryItems: 28,
  totalProfit: 3245.67
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { opportunities, isLoading: arbitrageLoading } = useSelector((state: RootState) => state.arbitrage);
  const { items, isLoading: inventoryLoading } = useSelector((state: RootState) => state.inventory);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // In a real app, these would fetch from the API
    // dispatch(fetchArbitrageOpportunities());
    // dispatch(fetchInventory());
  }, [dispatch]);

  // Sort opportunities by profit for top opportunities section
  const topOpportunities = [...(opportunities.length > 0 ? opportunities : [])].sort((a, b) => b.profit - a.profit).slice(0, 5);
  
  // For demo purposes, create some mock data if no real data exists
  const demoOpportunities = [
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
      lastUpdated: new Date().toISOString()
    }
  ];

  const displayOpportunities = topOpportunities.length > 0 ? topOpportunities : demoOpportunities;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Dashboard
      </Typography>
      
      {user?.subscription !== 'premium' && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h6">Upgrade to Premium</Typography>
          <Typography variant="body1">
            Get access to all product categories, real-time updates, and advanced analytics.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ mt: 1 }}
            onClick={() => navigate('/subscription')}
          >
            Upgrade Now - $9.99/month
          </Button>
        </Paper>
      )}
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Opportunities
              </Typography>
              <TrendingUpIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {mockStats.totalOpportunities}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              across all marketplaces
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                High Profit Items
              </Typography>
              <MonetizationOnIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {mockStats.highProfitOpportunities}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              with 30%+ profit margin
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Inventory Items
              </Typography>
              <InventoryIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              {mockStats.inventoryItems}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              currently in stock
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total Profit
              </Typography>
              <MonetizationOnIcon color="primary" />
            </Box>
            <Typography component="p" variant="h4">
              ${mockStats.totalProfit.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              potential from current opportunities
            </Typography>
          </Paper>
        </Grid>
        
        {/* Top Opportunities */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Top Arbitrage Opportunities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {displayOpportunities.map((opportunity) => (
                <React.Fragment key={opportunity.id}>
                  <ListItem alignItems="flex-start" button onClick={() => navigate('/search')}>
                    <ListItemAvatar>
                      <Avatar>
                        <StoreIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={opportunity.productName}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {opportunity.sourceMarketplace} → {opportunity.targetMarketplace}
                          </Typography>
                          {` — Buy: $${opportunity.sourcePrice.toFixed(2)} • Sell: $${opportunity.targetPrice.toFixed(2)}`}
                        </React.Fragment>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="h6" color="secondary">
                        ${opportunity.profit.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {opportunity.profitPercentage.toFixed(1)}% profit
                      </Typography>
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              color="primary" 
              sx={{ mt: 2, alignSelf: 'flex-end' }}
              onClick={() => navigate('/search')}
            >
              View All Opportunities
            </Button>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mb: 2 }}
              onClick={() => navigate('/search')}
            >
              Search Products
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mb: 2 }}
              onClick={() => navigate('/inventory')}
            >
              Manage Inventory
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mb: 2 }}
              onClick={() => navigate('/marketplaces')}
            >
              Connect Marketplaces
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate('/chat')}
            >
              Chat Assistant
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
