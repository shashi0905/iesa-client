import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
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
  Typography,
  Alert,
} from '@mui/material';
import {
  TrendingUp as AnalyticsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { analyticsService } from '../services/analyticsService';
import { DimensionType, AnalyticsSnapshot } from '../types';

const AnalyticsPage: React.FC = () => {
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<DimensionType>(
    DimensionType.SEGMENT
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadSnapshots();
    }
  }, [selectedDimension, startDate, endDate]);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await analyticsService.getSnapshotsByDimension(
        selectedDimension,
        startDate,
        endDate
      );
      setSnapshots(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTotals = () => {
    return {
      totalExpenses: snapshots.reduce((sum, s) => sum + s.totalExpenses, 0),
      totalCount: snapshots.reduce((sum, s) => sum + s.expenseCount, 0),
      approvedCount: snapshots.reduce((sum, s) => sum + s.approvedCount, 0),
      pendingCount: snapshots.reduce((sum, s) => sum + s.pendingCount, 0),
      rejectedCount: snapshots.reduce((sum, s) => sum + s.rejectedCount, 0),
      totalBudgetAllocated: snapshots.reduce(
        (sum, s) => sum + (s.totalBudgetAllocated || 0),
        0
      ),
      totalBudgetConsumed: snapshots.reduce(
        (sum, s) => sum + (s.totalBudgetConsumed || 0),
        0
      ),
    };
  };

  const totals = calculateTotals();

  if (loading && snapshots.length === 0) {
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
          <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Analytics</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadSnapshots}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Dimension</InputLabel>
                <Select
                  value={selectedDimension}
                  label="Dimension"
                  onChange={(e) =>
                    setSelectedDimension(e.target.value as DimensionType)
                  }
                >
                  <MenuItem value={DimensionType.SEGMENT}>Segment</MenuItem>
                  <MenuItem value={DimensionType.DEPARTMENT}>Department</MenuItem>
                  <MenuItem value={DimensionType.USER}>User</MenuItem>
                  <MenuItem value={DimensionType.CATEGORY}>Category</MenuItem>
                  <MenuItem value={DimensionType.TIME_PERIOD}>Time Period</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4">{formatCurrency(totals.totalExpenses)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expense Count
              </Typography>
              <Typography variant="h4">{totals.totalCount}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={`Approved: ${totals.approvedCount}`} size="small" color="success" />
                <Chip label={`Pending: ${totals.pendingCount}`} size="small" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Budget Allocated
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totals.totalBudgetAllocated)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Budget Consumed
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totals.totalBudgetConsumed)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {totals.totalBudgetAllocated > 0
                  ? `${((totals.totalBudgetConsumed / totals.totalBudgetAllocated) * 100).toFixed(1)}% utilized`
                  : '-'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Analytics by {selectedDimension}
          </Typography>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{selectedDimension}</TableCell>
                <TableCell align="right">Total Expenses</TableCell>
                <TableCell align="center">Count</TableCell>
                <TableCell align="center">Approved</TableCell>
                <TableCell align="center">Pending</TableCell>
                <TableCell align="center">Rejected</TableCell>
                <TableCell align="right">Budget Allocated</TableCell>
                <TableCell align="right">Budget Consumed</TableCell>
                <TableCell align="right">Utilization %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {snapshots.map((snapshot) => {
                const utilization =
                  snapshot.totalBudgetAllocated && snapshot.totalBudgetConsumed
                    ? (snapshot.totalBudgetConsumed / snapshot.totalBudgetAllocated) * 100
                    : 0;
                return (
                  <TableRow key={snapshot.id}>
                    <TableCell>{formatDate(snapshot.snapshotDate)}</TableCell>
                    <TableCell>
                      <Chip label={snapshot.dimensionValue} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(snapshot.totalExpenses)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{snapshot.expenseCount}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={snapshot.approvedCount}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={snapshot.pendingCount}
                        size="small"
                        color="warning"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={snapshot.rejectedCount}
                        size="small"
                        color="error"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(snapshot.totalBudgetAllocated)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(snapshot.totalBudgetConsumed)}
                    </TableCell>
                    <TableCell align="right">
                      {utilization > 0 ? (
                        <Chip
                          label={`${utilization.toFixed(1)}%`}
                          size="small"
                          color={
                            utilization >= 90
                              ? 'error'
                              : utilization >= 80
                              ? 'warning'
                              : 'success'
                          }
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {snapshots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                      No analytics data available for the selected period
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AnalyticsPage;
