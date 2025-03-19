import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ArbitrageOpportunity {
  id: string;
  productName: string;
  sourceMarketplace: string;
  sourcePrice: number;
  targetMarketplace: string;
  targetPrice: number;
  profit: number;
  profitPercentage: number;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  targetUrl: string;
  lastUpdated: string;
}

interface ArbitrageState {
  opportunities: ArbitrageOpportunity[];
  filteredOpportunities: ArbitrageOpportunity[];
  selectedOpportunity: ArbitrageOpportunity | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    minProfit: number;
    maxProfit: number;
    minProfitPercentage: number;
    sourceMarketplace: string;
    targetMarketplace: string;
    sortBy: 'profit' | 'profitPercentage' | 'lastUpdated';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: ArbitrageState = {
  opportunities: [],
  filteredOpportunities: [],
  selectedOpportunity: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    minProfit: 0,
    maxProfit: Infinity,
    minProfitPercentage: 0,
    sourceMarketplace: '',
    targetMarketplace: '',
    sortBy: 'profit',
    sortOrder: 'desc',
  },
};

export const fetchArbitrageOpportunities = createAsyncThunk(
  'arbitrage/fetchOpportunities',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      const response = await axios.get('/api/arbitrage/opportunities', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to fetch arbitrage opportunities');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'arbitrage/searchProducts',
  async (query: string, { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      const response = await axios.get(`/api/arbitrage/search?query=${query}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to search products');
    }
  }
);

const arbitrageSlice = createSlice({
  name: 'arbitrage',
  initialState,
  reducers: {
    setSelectedOpportunity: (state, action: PayloadAction < ArbitrageOpportunity > ) => {
      state.selectedOpportunity = action.payload;
    },
    clearSelectedOpportunity: (state) => {
      state.selectedOpportunity = null;
    },
    updateFilters: (state, action: PayloadAction < Partial < ArbitrageState['filters'] >> ) => {
      state.filters = { ...state.filters, ...action.payload };

      // Apply filters
      state.filteredOpportunities = state.opportunities.filter(opportunity => {
        if (state.filters.category && opportunity.category !== state.filters.category) return false;
        if (opportunity.profit < state.filters.minProfit) return false;
        if (state.filters.maxProfit !== Infinity && opportunity.profit > state.filters.maxProfit) return false;
        if (opportunity.profitPercentage < state.filters.minProfitPercentage) return false;
        if (state.filters.sourceMarketplace && opportunity.sourceMarketplace !== state.filters.sourceMarketplace) return false;
        if (state.filters.targetMarketplace && opportunity.targetMarketplace !== state.filters.targetMarketplace) return false;
        return true;
      });

      // Apply sorting
      state.filteredOpportunities.sort((a, b) => {
        const sortBy = state.filters.sortBy;
        const sortOrder = state.filters.sortOrder === 'asc' ? 1 : -1;

        if (sortBy === 'profit') {
          return (a.profit - b.profit) * sortOrder;
        } else if (sortBy === 'profitPercentage') {
          return (a.profitPercentage - b.profitPercentage) * sortOrder;
        } else {
          return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * sortOrder;
        }
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredOpportunities = state.opportunities;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArbitrageOpportunities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArbitrageOpportunities.fulfilled, (state, action: PayloadAction < ArbitrageOpportunity[] > ) => {
        state.isLoading = false;
        state.opportunities = action.payload;
        state.filteredOpportunities = action.payload;
      })
      .addCase(fetchArbitrageOpportunities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction < ArbitrageOpportunity[] > ) => {
        state.isLoading = false;
        state.opportunities = action.payload;
        state.filteredOpportunities = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedOpportunity,
  clearSelectedOpportunity,
  updateFilters,
  clearFilters
} = arbitrageSlice.actions;

export default arbitrageSlice.reducer;