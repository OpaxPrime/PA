import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  targetSellingPrice: number;
  category: string;
  imageUrl: string;
  sourceMarketplace: string;
  targetMarketplaces: string[];
  purchaseDate: string;
  status: 'in_stock' | 'listed' | 'sold' | 'shipped';
}

interface InventoryState {
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  selectedItem: InventoryItem | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    status: string;
    sourceMarketplace: string;
    targetMarketplace: string;
    sortBy: 'purchaseDate' | 'quantity' | 'purchasePrice' | 'targetSellingPrice';
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: InventoryState = {
  items: [],
  filteredItems: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    status: '',
    sourceMarketplace: '',
    targetMarketplace: '',
    sortBy: 'purchaseDate',
    sortOrder: 'desc',
  },
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      const response = await axios.get('/api/inventory', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to fetch inventory');
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addItem',
  async (item: Omit < InventoryItem, 'id' > , { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      const response = await axios.post('/api/inventory', item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to add inventory item');
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateItem',
  async (item: InventoryItem, { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      const response = await axios.put(`/api/inventory/${item.id}`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to update inventory item');
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteItem',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      // Replace with actual API endpoint when backend is implemented
      await axios.delete(`/api/inventory/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(getState() as any).auth.token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response ? .data ? .message || 'Failed to delete inventory item');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction < InventoryItem > ) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    updateFilters: (state, action: PayloadAction < Partial < InventoryState['filters'] >> ) => {
      state.filters = { ...state.filters, ...action.payload };

      // Apply filters
      state.filteredItems = state.items.filter(item => {
        if (state.filters.category && item.category !== state.filters.category) return false;
        if (state.filters.status && item.status !== state.filters.status) return false;
        if (state.filters.sourceMarketplace && item.sourceMarketplace !== state.filters.sourceMarketplace) return false;
        if (state.filters.targetMarketplace && !item.targetMarketplaces.includes(state.filters.targetMarketplace)) return false;
        return true;
      });

      // Apply sorting
      state.filteredItems.sort((a, b) => {
        const sortBy = state.filters.sortBy;
        const sortOrder = state.filters.sortOrder === 'asc' ? 1 : -1;

        if (sortBy === 'purchaseDate') {
          return (new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()) * sortOrder;
        } else if (sortBy === 'quantity') {
          return (a.quantity - b.quantity) * sortOrder;
        } else if (sortBy === 'purchasePrice') {
          return (a.purchasePrice - b.purchasePrice) * sortOrder;
        } else {
          return (a.targetSellingPrice - b.targetSellingPrice) * sortOrder;
        }
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredItems = state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action: PayloadAction < InventoryItem[] > ) => {
        state.isLoading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action: PayloadAction < InventoryItem > ) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.filteredItems = state.items;
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action: PayloadAction < InventoryItem > ) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.filteredItems = state.items;
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action: PayloadAction < string > ) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.filteredItems = state.items;
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedItem,
  clearSelectedItem,
  updateFilters,
  clearFilters
} = inventorySlice.actions;

export default inventorySlice.reducer;