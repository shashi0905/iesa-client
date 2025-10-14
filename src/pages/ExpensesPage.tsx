import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Receipt as ExpenseIcon,
} from '@mui/icons-material';
import { expenseService } from '../services/expenseService';
import { segmentService } from '../services/segmentService';
import { Expense, ExpenseStatus, CreateExpenseRequest, SegmentAllocationRequest, Segment } from '../types';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    expenseDate: new Date().toISOString().split('T')[0],
    vendor: '',
    totalAmount: 0,
    currency: 'USD',
    description: '',
    segmentAllocations: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [expensesData, segmentsData] = await Promise.all([
        expenseService.getAll(),
        segmentService.getAllActive(),
      ]);
      setExpenses(expensesData);
      setSegments(segmentsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setSelectedExpense(expense);
      setFormData({
        expenseDate: expense.expenseDate,
        vendor: expense.vendor || '',
        totalAmount: expense.totalAmount,
        currency: expense.currency,
        description: expense.description || '',
        segmentAllocations: expense.segmentAllocations.map(sa => ({
          segmentId: sa.segmentId,
          percentage: sa.percentage,
          description: sa.description,
        })),
      });
    } else {
      setSelectedExpense(null);
      setFormData({
        expenseDate: new Date().toISOString().split('T')[0],
        vendor: '',
        totalAmount: 0,
        currency: 'USD',
        description: '',
        segmentAllocations: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExpense(null);
  };

  const handleSubmit = async () => {
    try {
      setError('');

      // Validate segment allocations sum to 100%
      const totalPercentage = formData.segmentAllocations.reduce(
        (sum, alloc) => sum + alloc.percentage,
        0
      );

      if (totalPercentage !== 100) {
        setError(`Segment allocations must sum to 100%. Current sum: ${totalPercentage}%`);
        return;
      }

      if (selectedExpense) {
        await expenseService.update(selectedExpense.id, formData);
      } else {
        await expenseService.create(formData);
      }
      handleCloseDialog();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      setError('');
      await expenseService.delete(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleSubmitExpense = async (id: string) => {
    if (!window.confirm('Are you sure you want to submit this expense for approval?')) {
      return;
    }

    try {
      setError('');
      await expenseService.submit(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit expense');
    }
  };

  const handleApproveExpense = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this expense?')) {
      return;
    }

    try {
      setError('');
      await expenseService.approve(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve expense');
    }
  };

  const handleOpenRejectDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setRejectReason('');
    setOpenRejectDialog(true);
  };

  const handleRejectExpense = async () => {
    if (!selectedExpense) return;

    try {
      setError('');
      await expenseService.reject(selectedExpense.id, rejectReason);
      setOpenRejectDialog(false);
      setRejectReason('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject expense');
    }
  };

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setOpenViewDialog(true);
  };

  const addSegmentAllocation = () => {
    setFormData({
      ...formData,
      segmentAllocations: [
        ...formData.segmentAllocations,
        { segmentId: '', percentage: 0, description: '' },
      ],
    });
  };

  const updateSegmentAllocation = (index: number, field: keyof SegmentAllocationRequest, value: any) => {
    const updatedAllocations = [...formData.segmentAllocations];
    updatedAllocations[index] = { ...updatedAllocations[index], [field]: value };
    setFormData({ ...formData, segmentAllocations: updatedAllocations });
  };

  const removeSegmentAllocation = (index: number) => {
    setFormData({
      ...formData,
      segmentAllocations: formData.segmentAllocations.filter((_, i) => i !== index),
    });
  };

  const getTotalPercentage = () => {
    return formData.segmentAllocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case ExpenseStatus.DRAFT:
        return 'default';
      case ExpenseStatus.SUBMITTED:
        return 'primary';
      case ExpenseStatus.APPROVED:
        return 'success';
      case ExpenseStatus.REJECTED:
        return 'error';
      case ExpenseStatus.PAID:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const canEdit = (expense: Expense) => {
    return expense.status === 'DRAFT' || expense.status === 'REJECTED';
  };

  const canSubmit = (expense: Expense) => {
    return expense.status === 'DRAFT';
  };

  const canApprove = (expense: Expense) => {
    return expense.status === 'SUBMITTED';
  };

  const canReject = (expense: Expense) => {
    return expense.status === 'SUBMITTED';
  };

  const filteredExpenses = statusFilter === 'ALL'
    ? expenses
    : expenses.filter(expense => expense.status === statusFilter);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading expenses...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <ExpenseIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">Expenses</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Expense
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value={ExpenseStatus.DRAFT}>Draft</MenuItem>
            <MenuItem value={ExpenseStatus.SUBMITTED}>Submitted</MenuItem>
            <MenuItem value={ExpenseStatus.APPROVED}>Approved</MenuItem>
            <MenuItem value={ExpenseStatus.REJECTED}>Rejected</MenuItem>
            <MenuItem value={ExpenseStatus.PAID}>Paid</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Submitter</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Segments</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.submitterName}</TableCell>
                    <TableCell>{expense.vendor || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {expense.currency} {expense.totalAmount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={expense.status}
                        color={getStatusColor(expense.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        {expense.segmentAllocations.map((alloc, idx) => (
                          <Typography key={idx} variant="caption" color="text.secondary">
                            {alloc.segmentCode} ({alloc.percentage}%)
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleViewExpense(expense)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {canEdit(expense) && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(expense)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(expense.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {canSubmit(expense) && (
                        <Tooltip title="Submit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleSubmitExpense(expense.id)}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canApprove(expense) && (
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproveExpense(expense.id)}
                          >
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canReject(expense) && (
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenRejectDialog(expense)}
                          >
                            <RejectIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">No expenses found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Expense Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedExpense ? 'Edit Expense' : 'Create Expense'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expense Date"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Segment Allocations</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addSegmentAllocation}
                >
                  Add Segment
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Total: {getTotalPercentage()}% (must equal 100%)
              </Typography>
            </Grid>

            {formData.segmentAllocations.map((allocation, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5}>
                        <FormControl fullWidth>
                          <InputLabel>Segment</InputLabel>
                          <Select
                            value={allocation.segmentId}
                            label="Segment"
                            onChange={(e) => updateSegmentAllocation(index, 'segmentId', e.target.value)}
                          >
                            {segments.map((segment) => (
                              <MenuItem key={segment.id} value={segment.id}>
                                {segment.code} - {segment.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Percentage"
                          type="number"
                          value={allocation.percentage}
                          onChange={(e) => updateSegmentAllocation(index, 'percentage', parseFloat(e.target.value) || 0)}
                          inputProps={{ step: '0.01', min: '0', max: '100' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={allocation.description || ''}
                          onChange={(e) => updateSegmentAllocation(index, 'description', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => removeSegmentAllocation(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedExpense ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Expense Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Expense Details</DialogTitle>
        <DialogContent>
          {selectedExpense && (
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Submitter</Typography>
                  <Typography>{selectedExpense.submitterName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip label={selectedExpense.status} color={getStatusColor(selectedExpense.status)} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography>{new Date(selectedExpense.expenseDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Vendor</Typography>
                  <Typography>{selectedExpense.vendor || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                  <Typography fontWeight="bold">
                    {selectedExpense.currency} {selectedExpense.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography>{selectedExpense.description || '-'}</Typography>
                </Grid>
                {selectedExpense.rejectionReason && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      <Typography variant="subtitle2">Rejection Reason</Typography>
                      <Typography>{selectedExpense.rejectionReason}</Typography>
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" mb={2}>Segment Allocations</Typography>
                  {selectedExpense.segmentAllocations.map((alloc) => (
                    <Card key={alloc.id} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">Segment</Typography>
                            <Typography>{alloc.segmentCode} - {alloc.segmentName}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="subtitle2" color="text.secondary">Percentage</Typography>
                            <Typography>{alloc.percentage}%</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                            <Typography fontWeight="bold">
                              {selectedExpense.currency} {alloc.amount.toFixed(2)}
                            </Typography>
                          </Grid>
                          {alloc.description && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                              <Typography variant="body2">{alloc.description}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Expense Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Expense</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Rejection Reason"
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleRejectExpense} variant="contained" color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesPage;
