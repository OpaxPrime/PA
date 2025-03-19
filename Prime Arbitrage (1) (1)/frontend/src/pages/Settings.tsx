import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Avatar
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    phone: '555-123-4567',
    company: 'Arbitrage Ventures',
    notifyOpportunities: true,
    notifySales: true,
    notifyInventory: true,
    darkMode: false,
    language: 'English',
    currency: 'USD'
  });
  const [saved, setSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfileData({
      ...profileData,
      [name]: checked
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setSaved(true);
  };

  const handleCloseSnackbar = () => {
    setSaved(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {profileData.name.charAt(0)}
                </Avatar>
              }
              title={profileData.name}
              subheader={profileData.email}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Account Type: {user?.subscription === 'premium' ? 'Premium' : 'Free'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member Since: March 2023
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                href="/subscription"
              >
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={profileData.company}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifyOpportunities}
                      onChange={handleSwitchChange}
                      name="notifyOpportunities"
                      color="primary"
                    />
                  }
                  label="New Arbitrage Opportunities"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifySales}
                      onChange={handleSwitchChange}
                      name="notifySales"
                      color="primary"
                    />
                  }
                  label="Sales Updates"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.notifyInventory}
                      onChange={handleSwitchChange}
                      name="notifyInventory"
                      color="primary"
                    />
                  }
                  label="Inventory Alerts"
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Application Settings
            </Typography>
            
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.darkMode}
                      onChange={handleSwitchChange}
                      name="darkMode"
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
              </ListItem>
              <ListItem>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Language"
                      name="language"
                      value={profileData.language}
                      onChange={handleInputChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Currency"
                      name="currency"
                      value={profileData.currency}
                      onChange={handleInputChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </TextField>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={saved}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Settings saved successfully"
      />
    </Box>
  );
};

export default Settings;
