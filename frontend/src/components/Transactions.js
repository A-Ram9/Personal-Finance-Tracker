import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Card, Typography, Box, Select, MenuItem, IconButton } from '@mui/material';
import { Delete as DeleteOutlineIcon, Edit as EditNoteIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function Transactions({ onData, convertAmount, currencySymbol }) {
  const [transactions, setTransactions] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

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

  // Advanced Date Filtering Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = !filterType || t.type === filterType;
    
    if (!matchesSearch || !matchesType) return false;
    if (timeFilter === 'all') return true;

    const tDate = new Date(t.date);
    const now = new Date();
    
    if (timeFilter === 'week') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return tDate >= oneWeekAgo;
    }
    if (timeFilter === 'month') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Native CSV Export Engine
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['ID', 'Date', 'Category', 'Amount (Base INR)', 'Type\n'];
    const rows = filteredTransactions.map(t => `${t.id},${t.date},"${t.category}",${t.amount},${t.type}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fintrack_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card sx={{ p: 4, background: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>Ledger Operations</Typography>
        <Button 
          variant="outlined" 
          startIcon={<FileDownloadIcon />} 
          onClick={exportToCSV}
          disabled={filteredTransactions.length === 0}
          sx={{ borderRadius: '12px', border: '1px solid rgba(65, 105, 225, 0.3)' }}
        >
          Export CSV
        </Button>
      </Box>
      
      <TransactionForm onAdd={fetchTransactions} getHeaders={getHeaders} />

      {/* Control Filters Widget Layer */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 3, flexWrap: 'wrap' }}>
        <TextField label="Search Categories..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flexGrow: 2, minWidth: '200px' }} />
        
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} displayEmpty sx={{ flexGrow: 1, minWidth: '120px', borderRadius: '12px' }}>
          <MenuItem value="">All Scopes</MenuItem>
          <MenuItem value="income">Inflows</MenuItem>
          <MenuItem value="expense">Outflows</MenuItem>
        </Select>

        <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} sx={{ flexGrow: 1, minWidth: '120px', borderRadius: '12px' }}>
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="week">Past 7 Days</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </Box>

      {/* Ledger Container with AnimatePresence Core */}
      <Box sx={{ maxHeight: '380px', overflowY: 'auto', pr: 1 }}>
        <AnimatePresence initial={false}>
          {filteredTransactions.map(t => (
            <Box 
              key={t.id}
              component={motion.div}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 2,
                borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)',
                borderLeft: `5px solid ${t.type === 'income' ? '#4169E1' : '#FFD700'}`,
                transition: 'box-shadow 0.3s ease',
                '&:hover': { background: 'rgba(255,255,255,0.04)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }
              }}
            >
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
        </AnimatePresence>
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