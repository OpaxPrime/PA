import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Mock marketplace data
const mockMarketplaces = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://example.com/amazon-logo.png',
    connected: true,
    itemsListed: 12,
    pendingSales: 3,
    completedSales: 8
  },
  {
    id: 'ebay',
    name: 'eBay',
    logo: 'https://example.com/ebay-logo.png',
    connected: true,
    itemsListed: 8,
    pendingSales: 1,
    completedSales: 5
  },
  {
    id: 'walmart',
    name: 'Walmart',
    logo: 'https://example.com/walmart-logo.png',
    connected: false,
    itemsListed: 0,
    pendingSales: 0,
    completedSales: 0
  },
  {
    id: 'target',
    name: 'Target',
    logo: 'https://example.com/target-logo.png',
    connected: false,
    itemsListed: 0,
    pendingSales: 0,
    completedSales: 0
  },
  {
    id: 'bestbuy',
    name: 'Best Buy',
    logo: 'https://example.com/bestbuy-logo.png',
    connected: false,
    itemsListed: 0,
    pendingSales: 0,
    completedSales: 0
  }
];

// Mock listings data
const mockListings = [
  {
    id: '1',
    productName: 'Sony WH-1000XM4 Wireless Headphones',
    marketplace: 'Amazon',
    price: 329.99,
    status: 'active',
    views: 156,
    watchers: 12,
    dateCreated: '2023-03-15T10:30:00Z'
  },
  {
    id: '2',
    productName: 'Sony WH-1000XM4 Wireless Headphones',
    marketplace: 'eBay',
    price: 349.99,
    status: 'active',
    views: 89,
    watchers: 7,
    dateCreated: '2023-03-16T14:45:00Z'
  },
  {
    id: '3',
    productName: 'PlayStation 5 Digital Edition',
    marketplace: 'Amazon',
    price: 550.00,
    status: 'active',
    views: 312,
    watchers: 28,
    dateCreated: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    productName: 'PlayStation 5 Digital Edition',
    marketplace: 'eBay',
    price: 575.00,
    status: 'active',
    views: 245,
    watchers: 19,
    dateCreated: '2023-03-11T11:20:00Z'
  },
  {
    id: '5',
    productName: 'Nike Air Jordan 1 Retro High',
    marketplace: 'eBay',
    price: 250.00,
    status: 'active',
    views: 178,
    watchers: 15,
    dateCreated: '2023-03-14T16:30:00Z'
  }
];

const Marketplaces: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [marketplaces, setMarketplaces] = useState(mockMarketplaces);
  const [listings, setListings] = useState(mockListings);
  const { user } = useSelector((state: RootState) => state.auth);
  const isPremium = user?.subscription === 'premium';

  // Filter marketplaces based on subscription
  const filteredMarketplaces = isPremium ? marketplaces : marketplaces.slice(0, 2);
  
  // Filter listings based on subscription
  const filteredListings = isPremium ? listings : listings.slice(0, 2);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleConnect = (id: string) => {
    setMarketplaces(
      marketplaces.map(marketplace => 
        marketplace.id === id ? { ...marketplace, connected: true } : marketplace
      )
    );
  };

  const handleDisconnect = (id: string) => {
    setMarketplaces(
      marketplaces.map(marketplace => 
        marketplace.id === id ? { ...marketplace, connected: false } : marketplace
      )
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Marketplace Integration
      </Typography>
      
      {!isPremium && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Free users can connect up to 2 marketplaces. Upgrade to Premium for unlimited marketplace integration.
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="marketplace tabs">
          <Tab label="Connected Marketplaces" />
          <Tab label="Listings" />
        </Tabs>
      </Box>
      
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {filteredMarketplaces.map((marketplace) => (
            <Grid item xs={12} sm={6} md={4} key={marketplace.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Logo
                      </Typography>
                    </Box>
                    <Typography variant="h6" component="div">
                      {marketplace.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={marketplace.connected ? 'Connected' : 'Not Connected'} 
                      color={marketplace.connected ? 'success' : 'default'} 
                      size="small" 
                    />
                  </Box>
                  
                  {marketplace.connected && (
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Items Listed" 
                          secondary={marketplace.itemsListed} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Pending Sales" 
                          secondary={marketplace.pendingSales} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Completed Sales" 
                          secondary={marketplace.completedSales} 
                        />
                      </ListItem>
                    </List>
                  )}
                </CardContent>
                <CardActions>
                  {marketplace.connected ? (
                    <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleDisconnect(marketplace.id)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      color="primary" 
                      onClick={() => handleConnect(marketplace.id)}
                    >
                      Connect
                    </Button>
                  )}
                  {marketplace.connected && (
                    <Button size="small" color="primary">
                      Sync Inventory
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Listings
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            {filteredListings.map((listing) => (
              <Card key={listing.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" component="div">
                        {listing.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Listed on {listing.marketplace}
                      </Typography>
                      <Chip 
                        label={listing.status.charAt(0).toUpperCase() + listing.status.slice(1)} 
                        color="success" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Typography variant="h6" color="primary">
                          ${listing.price.toFixed(2)}
                        </Typography>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Views: {listing.views}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Watchers: {listing.watchers}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit Listing</Button>
                  <Button size="small" color="secondary">End Listing</Button>
                  <Button size="small" color="primary">View on {listing.marketplace}</Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Marketplaces;
