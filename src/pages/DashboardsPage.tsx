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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Share as ShareIcon,
  Star as StarIcon,
  Widgets as WidgetIcon,
} from '@mui/icons-material';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import {
  Dashboard,
  CreateDashboardRequest,
  UpdateDashboardRequest,
  DashboardWidget,
  CreateDashboardWidgetRequest,
  Report,
} from '../types';

const DashboardsPage: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openWidgetDialog, setOpenWidgetDialog] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [formData, setFormData] = useState<CreateDashboardRequest>({
    name: '',
  });
  const [widgetFormData, setWidgetFormData] = useState<CreateDashboardWidgetRequest>({
    dashboardId: '',
    reportId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [dashboardData, reportData] = await Promise.all([
        dashboardService.getAllDashboards(),
        reportService.getAllReports(),
      ]);
      setDashboards(dashboardData);
      setReports(reportData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (dashboard?: Dashboard) => {
    if (dashboard) {
      setEditingDashboard(dashboard);
      setFormData({
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
        isDefault: dashboard.isDefault,
        isShared: dashboard.isShared,
      });
    } else {
      setEditingDashboard(null);
      setFormData({
        name: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDashboard(null);
    setError('');
  };

  const handleOpenWidgetDialog = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard);
    setWidgetFormData({
      dashboardId: dashboard.id,
      reportId: '',
    });
    setOpenWidgetDialog(true);
  };

  const handleCloseWidgetDialog = () => {
    setOpenWidgetDialog(false);
    setSelectedDashboard(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      if (editingDashboard) {
        const updateData: UpdateDashboardRequest = {
          name: formData.name,
          description: formData.description,
          layout: formData.layout,
          isDefault: formData.isDefault,
          isShared: formData.isShared,
        };
        await dashboardService.updateDashboard(editingDashboard.id, updateData);
        setSuccess('Dashboard updated successfully');
      } else {
        await dashboardService.createDashboard(formData);
        setSuccess('Dashboard created successfully');
      }
      handleCloseDialog();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save dashboard');
    }
  };

  const handleSaveWidget = async () => {
    try {
      setError('');
      await dashboardService.createWidget(widgetFormData);
      setSuccess('Widget added successfully');
      handleCloseWidgetDialog();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add widget');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this dashboard?')) {
      return;
    }
    try {
      setError('');
      await dashboardService.deleteDashboard(id);
      setSuccess('Dashboard deleted successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete dashboard');
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!window.confirm('Are you sure you want to remove this widget?')) {
      return;
    }
    try {
      setError('');
      await dashboardService.deleteWidget(widgetId);
      setSuccess('Widget removed successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove widget');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setError('');
      await dashboardService.setDefaultDashboard(id);
      setSuccess('Default dashboard set successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set default dashboard');
    }
  };

  const handleToggleShare = async (dashboard: Dashboard) => {
    try {
      setError('');
      if (dashboard.isShared) {
        await dashboardService.unshareDashboard(dashboard.id);
        setSuccess('Dashboard unshared');
      } else {
        await dashboardService.shareDashboard(dashboard.id);
        setSuccess('Dashboard shared');
      }
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle share status');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Dashboards</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Dashboard
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

      {/* Dashboard Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Dashboards
              </Typography>
              <Typography variant="h4">{dashboards.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Shared Dashboards
              </Typography>
              <Typography variant="h4">
                {dashboards.filter((d) => d.isShared).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Widgets
              </Typography>
              <Typography variant="h4">
                {dashboards.reduce((sum, d) => sum + d.widgets.length, 0)}
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
                <TableCell>Owner</TableCell>
                <TableCell align="center">Widgets</TableCell>
                <TableCell>Default</TableCell>
                <TableCell>Shared</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboards.map((dashboard) => (
                <TableRow key={dashboard.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {dashboard.name}
                    </Typography>
                    {dashboard.description && (
                      <Typography variant="caption" color="textSecondary">
                        {dashboard.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{dashboard.ownerName}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={dashboard.widgets.length}
                      size="small"
                      icon={<WidgetIcon />}
                    />
                  </TableCell>
                  <TableCell>
                    {dashboard.isDefault ? (
                      <Chip label="Default" size="small" color="primary" icon={<StarIcon />} />
                    ) : (
                      <Button
                        size="small"
                        onClick={() => handleSetDefault(dashboard.id)}
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleShare(dashboard)}
                    >
                      {dashboard.isShared ? (
                        <ShareIcon color="primary" />
                      ) : (
                        <ShareIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{formatDate(dashboard.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Add Widget">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenWidgetDialog(dashboard)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(dashboard)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(dashboard.id)}
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

      {/* Create/Edit Dashboard Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDashboard ? 'Edit Dashboard' : 'Create Dashboard'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Dashboard Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                />
              }
              label="Set as default dashboard"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isShared || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isShared: e.target.checked })
                  }
                />
              }
              label="Share with other users"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingDashboard ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Widget Dialog */}
      <Dialog
        open={openWidgetDialog}
        onClose={handleCloseWidgetDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Widget to Dashboard</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Select Report</InputLabel>
              <Select
                value={widgetFormData.reportId}
                label="Select Report"
                onChange={(e) =>
                  setWidgetFormData({
                    ...widgetFormData,
                    reportId: e.target.value,
                  })
                }
              >
                {reports.map((report) => (
                  <MenuItem key={report.id} value={report.id}>
                    {report.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Widget Title (Optional)"
              value={widgetFormData.title || ''}
              onChange={(e) =>
                setWidgetFormData({ ...widgetFormData, title: e.target.value })
              }
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Refresh Interval (seconds)"
                  type="number"
                  value={widgetFormData.refreshInterval || ''}
                  onChange={(e) =>
                    setWidgetFormData({
                      ...widgetFormData,
                      refreshInterval: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Order Index"
                  type="number"
                  value={widgetFormData.orderIndex || ''}
                  onChange={(e) =>
                    setWidgetFormData({
                      ...widgetFormData,
                      orderIndex: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWidgetDialog}>Cancel</Button>
          <Button onClick={handleSaveWidget} variant="contained">
            Add Widget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardsPage;
