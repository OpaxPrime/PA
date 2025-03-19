import React, { useState, useEffect } from 'react';
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
  TextField,
  Alert
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import useStripeService from '../hooks/useStripeService';

// Initialize Stripe (in a real app, you would use your actual publishable key)
const stripePromise = loadStripe('pk_test_stripe_publishable_key');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { createSubscription, isLoading } = useStripeService();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        setError('Card element not found');
        setProcessing(false);
        return;
      }
      
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        setError(error.message || 'An error occurred with your payment');
        setProcessing(false);
        return;
      }
      
      // Create subscription with payment method
      const result = await createSubscription(paymentMethod.id);
      
      if (result.success) {
        setSucceeded(true);
        // In a real app, you would update the user's subscription status in Redux
        // dispatch(updateSubscription('premium'));
      } else {
        setError(result.error || 'Failed to create subscription');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
      console.error(err);
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {succeeded ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment successful! Your premium subscription is now active.
        </Alert>
      ) : (
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={!stripe || processing}
          fullWidth
        >
          {processing ? 'Processing...' : 'Subscribe Now - $9.99/month'}
        </Button>
      )}
    </form>
  );
};

const Subscription: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isPremium = user?.subscription === 'premium';
  const { cancelSubscription, isLoading } = useStripeService();
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancelSubscription = async () => {
    // In a real app, you would get the subscription ID from the user object
    const subscriptionId = 'sub_123456';
    
    const result = await cancelSubscription(subscriptionId);
    
    if (result.success) {
      setCancelSuccess(true);
      // In a real app, you would update the user's subscription status in Redux
      // dispatch(updateSubscription('free'));
    } else {
      setCancelError(result.error || 'Failed to cancel subscription');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div">
        Subscription
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Current Plan: {isPremium ? 'Premium' : 'Free'}
            </Typography>
            
            {isPremium ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  You are currently on the Premium plan with full access to all features.
                </Alert>
                <Typography variant="body1" paragraph>
                  Your premium subscription provides:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Unlimited product category access" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Real-time pricing data updates" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Advanced analytics and reporting" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Unlimited chat assistant usage" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Multi-marketplace integration" />
                  </ListItem>
                </List>
                
                {cancelSuccess ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your subscription has been canceled. You will continue to have Premium access until the end of your current billing period.
                  </Alert>
                ) : (
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ mt: 2 }}
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Cancel Subscription'}
                  </Button>
                )}
                
                {cancelError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {cancelError}
                  </Alert>
                )}
              </>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  You are currently on the Free plan with limited access.
                </Alert>
                <Typography variant="body1" paragraph>
                  Your free plan includes:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Limited product category access" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Basic pricing data (updated daily)" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Standard analytics" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Limited chat assistant usage" />
                  </ListItem>
                </List>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {!isPremium && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Upgrade to Premium
              </Typography>
              <Typography variant="body1" paragraph>
                Get full access to all features for just $9.99/month:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="All Product Categories" 
                    secondary="Access opportunities across all product categories without restrictions" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Real-Time Data Updates" 
                    secondary="Get the latest pricing data as soon as it's available" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Advanced Analytics" 
                    secondary="Detailed profit projections and trend analysis" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Unlimited Chat Assistant" 
                    secondary="Get unlimited help from our AI assistant" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Priority Support" 
                    secondary="Get faster responses from our support team" 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Subscription;
