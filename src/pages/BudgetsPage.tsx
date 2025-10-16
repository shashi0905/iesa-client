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
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
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
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as BudgetIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { budgetService } from '../services/budgetService';
import { segmentService } from '../services/segmentService';
import { departmentService } from '../services/departmentService';
import {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  BudgetPeriod,
  Segment,
  Department,
} from '../types';

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<CreateBudgetRequest>({
    name: '',
    period: BudgetPeriod.QUARTERLY,
    startDate: '',
    endDate: '',
    allocatedAmount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [budgetData, segmentData, departmentData] = await Promise.all([
        budgetService.getAllBudgets(),
        segmentService.getAll(),
        departmentService.getAll(),
      ]);
      setBudgets(budgetData);
      setSegments(segmentData);
      setDepartments(departmentData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        name: budget.name,
        segmentId: budget.segmentId,
        departmentId: budget.departmentId,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        allocatedAmount: budget.allocatedAmount,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        name: '',
        period: BudgetPeriod.QUARTERLY,
        startDate: '',
        endDate: '',
        allocatedAmount: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      if (editingBudget) {
        const updateData: UpdateBudgetRequest = {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          allocatedAmount: formData.allocatedAmount,
        };
        await budgetService.updateBudget(editingBudget.id, updateData);
        setSuccess('Budget updated successfully');
      } else {
        await budgetService.createBudget(formData);
        setSuccess('Budget created successfully');
      }
      handleCloseDialog();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }
    try {
      setError('');
      await budgetService.deleteBudget(id);
      setSuccess('Budget deleted successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete budget');
    }
  };

  const handleToggleActive = async (budget: Budget) => {
    try {
      setError('');
      if (budget.isActive) {
        await budgetService.deactivateBudget(budget.id);
        setSuccess('Budget deactivated');
      } else {
        await budgetService.activateBudget(budget.id);
        setSuccess('Budget activated');
      }
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle budget status');
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BudgetIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Budget Management</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Budget
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Budget Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Budgets
              </Typography>
              <Typography variant="h4">{budgets.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Budgets
              </Typography>
              <Typography variant="h4">
                {budgets.filter((b) => b.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Allocated
              </Typography>
              <Typography variant="h4">
                {formatCurrency(
                  budgets.reduce((sum, b) => sum + b.allocatedAmount, 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Consumed
              </Typography>
              <Typography variant="h4">
                {formatCurrency(
                  budgets.reduce((sum, b) => sum + b.consumedAmount, 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Segment/Department</TableCell>
                <TableCell>Date Range</TableCell>
                <TableCell align="right">Allocated</TableCell>
                <TableCell align="right">Consumed</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell>Utilization</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {budget.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={budget.period} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {budget.segmentName || '-'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {budget.departmentName || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(budget.allocatedAmount)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(budget.consumedAmount)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={
                        budget.remainingAmount < 0 ? 'error.main' : 'success.main'
                      }
                    >
                      {formatCurrency(budget.remainingAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(budget.utilizationPercentage, 100)}
                        color={getUtilizationColor(budget.utilizationPercentage)}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                      />
                      <Typography variant="caption">
                        {budget.utilizationPercentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={budget.isActive ? <ActiveIcon /> : <InactiveIcon />}
                      label={budget.isActive ? 'Active' : 'Inactive'}
                      color={budget.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(budget)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={budget.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(budget)}
                      >
                        {budget.isActive ? <InactiveIcon /> : <ActiveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Create Budget'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Budget Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={formData.period}
                    label="Period"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period: e.target.value,
                      })
                    }
                    disabled={!!editingBudget}
                  >
                    <MenuItem value={BudgetPeriod.MONTHLY}>Monthly</MenuItem>
                    <MenuItem value={BudgetPeriod.QUARTERLY}>Quarterly</MenuItem>
                    <MenuItem value={BudgetPeriod.ANNUAL}>Annual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Segment (Optional)</InputLabel>
                  <Select
                    value={formData.segmentId || ''}
                    label="Segment (Optional)"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        segmentId: e.target.value || undefined,
                      })
                    }
                    disabled={!!editingBudget}
                  >
                    <MenuItem value="">None</MenuItem>
                    {segments.map((segment) => (
                      <MenuItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Department (Optional)</InputLabel>
              <Select
                value={formData.departmentId || ''}
                label="Department (Optional)"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departmentId: e.target.value || undefined,
                  })
                }
                disabled={!!editingBudget}
              >
                <MenuItem value="">None</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Allocated Amount"
              type="number"
              value={formData.allocatedAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  allocatedAmount: parseFloat(e.target.value),
                })
              }
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingBudget ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetsPage;
