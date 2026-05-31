import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Card, Typography, Box, Select, MenuItem, IconButton } from '@mui/material';
import { Delete as DeleteOutlineIcon, Edit as EditNoteIcon } from '@mui/icons-material';

function Transactions({ onData, convertAmount, currencySymbol }) {
  const [transactions, setTransactions] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const fetchTransactions = () => {
    axios.get('http://localhost:5000/transactions', getHeaders())
      .then(res => {
        setTransactions(res.data);
        onData(res.data);
      }).catch(err => console.log(err));
  };

  useEffect(() => { fetchTransactions(); }, []);

  const deleteTransaction = async (id) => {
    await axios.delete(`http://localhost:5000/transactions/${id}`, getHeaders());
    fetchTransactions();
  };

  const openEdit = (transaction) => {
    setEditData(transaction);
    setEditOpen(true);
  };

  const handleEditChange = (e) => { setEditData({ ...editData, [e.target.name]: e.target.value }); };

  const saveEdit = async () => {
    await axios.put(`http://localhost:5000/transactions/${editData.id}`, editData, getHeaders());
    setEditOpen(false);
    fetchTransactions();
  };

  const filteredTransactions = transactions.filter(t => {
    return t.category.toLowerCase().includes(search.toLowerCase()) && (!filterType || t.type === filterType);
  });

  return (
    <Card sx={{ p: 4, background: 'background.paper' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 900, color: 'primary.main' }}>Ledger Operations</Typography>
      <TransactionForm onAdd={fetchTransactions} getHeaders={getHeaders} />

      <Box sx={{ display: 'flex', gap: 2, my: 3 }}>
        <TextField label="Search Categories..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flexGrow: 1 }} />
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} displayEmpty sx={{ minWidth: 140, borderRadius: '12px' }}>
          <MenuItem value="">All Scopes</MenuItem>
          <MenuItem value="income">Inflows</MenuItem>
          <MenuItem value="expense">Outflows</MenuItem>
        </Select>
      </Box>

      <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
        {filteredTransactions.map(t => (
          <Box key={t.id} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 2,
            borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: `5px solid ${t.type === 'income' ? '#4169E1' : '#FFD700'}`,
            transition: 'all 0.2s', '&:hover': { transform: 'scale(1.005)', background: 'rgba(255,255,255,0.05)' }
          }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{t.category}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 800, mr: 2, color: t.type === 'income' ? '#4169E1' : '#FFD700' }}>
                {t.type === 'income' ? '+' : '-'}{currencySymbol}{convertAmount(t.amount)}
              </Typography>
              <IconButton size="small" onClick={() => openEdit(t)} sx={{ color: 'primary.main' }}><EditNoteIcon /></IconButton>
              <IconButton size="small" onClick={() => deleteTransaction(t.id)} sx={{ color: 'secondary.main' }}><DeleteOutlineIcon /></IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Glass Dialog Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{ sx: { p: 3, borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Modify History</DialogTitle>
        <DialogContent>
          <TextField margin="dense" type="date" name="date" value={editData?.date || ''} onChange={handleEditChange} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField margin="dense" name="category" label="Category" value={editData?.category || ''} onChange={handleEditChange} fullWidth />
          <TextField margin="dense" name="amount" label="Amount (Base INR)" type="number" value={editData?.amount || ''} onChange={handleEditChange} fullWidth />
          <TextField margin="dense" name="type" label="Type (income/expense)" value={editData?.type || ''} onChange={handleEditChange} fullWidth />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={saveEdit} variant="contained" color="primary">Commit Alteration</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Transactions;