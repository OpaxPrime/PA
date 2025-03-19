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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Mock inventory data
const mockInventoryItems = [
  {
    id: '1',
    productName: 'Sony WH-1000XM4 Wireless Headphones',
    sku: 'SONY-WH1000XM4',
    quantity: 5,
    purchasePrice: 248.00,
    targetSellingPrice: 329.99,
    category: 'Electronics',
    imageUrl: 'https://example.com/headphones.jpg',
    sourceMarketplace: 'Amazon',
    targetMarketplaces: ['eBay', 'Facebook Marketplace'],
    purchaseDate: new Date().toISOString(),
    status: 'in_stock'
  },
  {
    id: '2',
    productName: 'Nike Air Jordan 1 Retro High',
    sku: 'NIKE-AJ1-RH',
    quantity: 3,
    purchasePrice: 170.00,
    targetSellingPrice: 250.00,
    category: 'Shoes',
    imageUrl: 'https://example.com/shoes.jpg',
    sourceMarketplace: 'Nike',
    targetMarketplaces: ['StockX', 'eBay'],
    purchaseDate: new Date().toISOString(),
    status: 'listed'
  },
  {
    id: '3',
    productName: 'PlayStation 5 Digital Edition',
    sku: 'PS5-DIGITAL',
    quantity: 2,
    purchasePrice: 399.99,
    targetSellingPrice: 550.00,
    category: 'Electronics',
    imageUrl: 'https://example.com/ps5.jpg',
    sourceMarketplace: 'Walmart',
    targetMarketplaces: ['eBay', 'Facebook Marketplace'],
    purchaseDate: new Date().toISOString(),
    status: 'in_stock'
  }
];

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isPremium = user?.subscription === 'premium';

  // Filter items based on subscription
  const filteredItems = isPremium ? inventoryItems : inventoryItems.slice(0, 1);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      setCurrentItem({
        productName: '',
        sku: '',
        quantity: 1,
        purchasePrice: 0,
        targetSellingPrice: 0,
        category: 'Electronics',
        sourceMarketplace: '',
        targetMarketplaces: [],
        status: 'in_stock'
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleSaveItem = () => {
    if (isEditing) {
      // Update existing item
      setInventoryItems(
        inventoryItems.map(item => 
          item.id === currentItem.id ? currentItem : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        id: Date.now().toString(),
        purchaseDate: new Date().toISOString()
      };
      setInventoryItems([...inventoryItems, newItem]);
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div">
          Inventory Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!isPremium && inventoryItems.length >= 1}
        >
          Add Item
        </Button>
      </Box>

      {!isPremium && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Free users can manage up to 1 inventory item. Upgrade to Premium for unlimited inventory management.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Purchase Price</TableCell>
              <TableCell align="right">Target Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.productName}
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.purchasePrice.toFixed(2)}</TableCell>
                <TableCell align="right">${item.targetSellingPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status === 'in_stock' ? 'In Stock' : 'Listed'} 
                    color={item.status === 'in_stock' ? 'primary' : 'success'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{item.sourceMarketplace}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={currentItem?.productName || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={currentItem?.sku || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={currentItem?.quantity || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={currentItem?.purchasePrice || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Target Selling Price"
                name="targetSellingPrice"
                type="number"
                value={currentItem?.targetSellingPrice || 0}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentItem?.category || 'Electronics'}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Shoes">Shoes</MenuItem>
                  <MenuItem value="Home & Kitchen">Home & Kitchen</MenuItem>
                  <MenuItem value="Toys">Toys</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source Marketplace"
                name="sourceMarketplace"
                value={currentItem?.sourceMarketplace || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentItem?.status || 'in_stock'}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="in_stock">In Stock</MenuItem>
                  <MenuItem value="listed">Listed</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="shipping">Shipping</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
