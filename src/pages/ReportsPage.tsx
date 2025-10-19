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
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as ReportIcon,
  PlayArrow as ExecuteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { reportService } from '../services/reportService';
import { reportTemplateService } from '../services/reportTemplateService';
import {
  Report,
  ReportTemplate,
  CreateReportRequest,
  UpdateReportRequest,
  ReportExecutionResult,
} from '../types';

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [executionResult, setExecutionResult] = useState<ReportExecutionResult | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<CreateReportRequest>({
    name: '',
    templateId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reportData, templateData] = await Promise.all([
        reportService.getAllReports(),
        reportTemplateService.getAllTemplates(),
      ]);
      setReports(reportData);
      setTemplates(templateData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (report?: Report) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description,
        templateId: report.templateId,
        filters: report.filters,
        startDate: report.startDate,
        endDate: report.endDate,
        scheduledCron: report.scheduledCron,
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: '',
        templateId: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReport(null);
    setError('');
  };

  const handleSave = async () => {
    try {
      setError('');
      if (editingReport) {
        const updateData: UpdateReportRequest = {
          name: formData.name,
          description: formData.description,
          filters: formData.filters,
          startDate: formData.startDate,
          endDate: formData.endDate,
          scheduledCron: formData.scheduledCron,
        };
        await reportService.updateReport(editingReport.id, updateData);
        setSuccess('Report updated successfully');
      } else {
        await reportService.createReport(formData);
        setSuccess('Report created successfully');
      }
      handleCloseDialog();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save report');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }
    try {
      setError('');
      await reportService.deleteReport(id);
      setSuccess('Report deleted successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleExecute = async (id: string) => {
    try {
      setError('');
      setLoading(true);
      const result = await reportService.executeReport(id);
      setExecutionResult(result);
      setSuccess('Report executed successfully');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute report');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      setError('');
      await reportService.toggleFavorite(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle favorite');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
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
          <ReportIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4">Reports & Analytics</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Report
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

      {/* Report Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Reports
              </Typography>
              <Typography variant="h4">{reports.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Favorite Reports
              </Typography>
              <Typography variant="h4">
                {reports.filter((r) => r.isFavorite).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Report Templates
              </Typography>
              <Typography variant="h4">{templates.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Templates
              </Typography>
              <Typography variant="h4">
                {templates.filter((t) => t.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="My Reports" />
          <Tab label="Report Templates" />
        </Tabs>

        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Date Range</TableCell>
                  <TableCell>Last Executed</TableCell>
                  <TableCell align="center">Executions</TableCell>
                  <TableCell align="center">Favorite</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {report.name}
                      </Typography>
                      {report.description && (
                        <Typography variant="caption" color="textSecondary">
                          {report.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={report.templateName} size="small" />
                    </TableCell>
                    <TableCell>
                      {formatDate(report.startDate)} - {formatDate(report.endDate)}
                    </TableCell>
                    <TableCell>{formatDateTime(report.lastExecutedAt)}</TableCell>
                    <TableCell align="center">{report.executionCount}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleFavorite(report.id)}
                      >
                        {report.isFavorite ? (
                          <StarIcon color="warning" />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Execute Report">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleExecute(report.id)}
                        >
                          <ExecuteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(report)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(report.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Report Type</TableCell>
                  <TableCell>Visualization</TableCell>
                  <TableCell>System Template</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {template.name}
                      </Typography>
                      {template.description && (
                        <Typography variant="caption" color="textSecondary">
                          {template.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={template.reportType} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={template.visualizationType} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      {template.isSystemTemplate ? (
                        <Chip label="System" size="small" color="info" />
                      ) : (
                        <Chip label="Custom" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {template.isActive ? (
                        <Chip label="Active" size="small" color="success" />
                      ) : (
                        <Chip label="Inactive" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingReport ? 'Edit Report' : 'Create Report'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Report Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Report Template</InputLabel>
              <Select
                value={formData.templateId}
                label="Report Template"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templateId: e.target.value,
                  })
                }
                disabled={!!editingReport}
              >
                {templates
                  .filter((t) => t.isActive)
                  .map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} ({template.reportType})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Schedule (Cron Expression)"
              value={formData.scheduledCron || ''}
              onChange={(e) =>
                setFormData({ ...formData, scheduledCron: e.target.value })
              }
              placeholder="0 0 * * * (daily at midnight)"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingReport ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Execution Result Dialog */}
      {executionResult && (
        <Dialog
          open={!!executionResult}
          onClose={() => setExecutionResult(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Report Execution Result: {executionResult.reportName}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Chip label={executionResult.reportType} size="small" sx={{ mr: 1 }} />
              <Chip
                label={executionResult.visualizationType}
                size="small"
                color="primary"
              />
            </Box>
            <Typography variant="caption" color="textSecondary">
              Executed at: {formatDateTime(executionResult.executedAt)}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <pre>{JSON.stringify(executionResult.data, null, 2)}</pre>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExecutionResult(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ReportsPage;
