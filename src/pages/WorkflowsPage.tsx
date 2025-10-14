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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountTree as WorkflowIcon,
  Add as AddStepIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { approvalWorkflowService } from '../services/approvalWorkflowService';
import { ApprovalWorkflow, CreateApprovalWorkflowRequest, ApprovalStepRequest } from '../types';

const WorkflowsPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [formData, setFormData] = useState<CreateApprovalWorkflowRequest>({
    name: '',
    description: '',
    steps: [],
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await approvalWorkflowService.getAll();
      setWorkflows(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (workflow?: ApprovalWorkflow) => {
    if (workflow) {
      setSelectedWorkflow(workflow);
      setFormData({
        name: workflow.name,
        description: workflow.description || '',
        steps: workflow.steps.map(step => ({
          stepOrder: step.stepOrder,
          approverRoleId: step.approverRoleId,
          approverUserId: step.approverUserId,
          condition: step.condition,
          isMandatory: step.isMandatory,
          stepName: step.stepName,
        })),
      });
    } else {
      setSelectedWorkflow(null);
      setFormData({
        name: '',
        description: '',
        steps: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkflow(null);
  };

  const handleSubmit = async () => {
    try {
      setError('');

      if (selectedWorkflow) {
        await approvalWorkflowService.update(selectedWorkflow.id, formData);
      } else {
        await approvalWorkflowService.create(formData);
      }
      handleCloseDialog();
      loadWorkflows();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save workflow');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      setError('');
      await approvalWorkflowService.delete(id);
      loadWorkflows();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete workflow');
    }
  };

  const handleToggleActive = async (workflow: ApprovalWorkflow) => {
    try {
      setError('');
      if (workflow.isActive) {
        await approvalWorkflowService.deactivate(workflow.id);
      } else {
        await approvalWorkflowService.activate(workflow.id);
      }
      loadWorkflows();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update workflow status');
    }
  };

  const handleViewWorkflow = (workflow: ApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    setOpenViewDialog(true);
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...(formData.steps || []),
        {
          stepOrder: (formData.steps?.length || 0) + 1,
          isMandatory: true,
        },
      ],
    });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps?.filter((_, i) => i !== index) || [];
    // Re-order steps
    newSteps.forEach((step, idx) => {
      step.stepOrder = idx + 1;
    });
    setFormData({ ...formData, steps: newSteps });
  };

  const updateStep = (index: number, field: keyof ApprovalStepRequest, value: any) => {
    const updatedSteps = [...(formData.steps || [])];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFormData({ ...formData, steps: updatedSteps });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading workflows...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <WorkflowIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">Approval Workflows</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Workflow
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Steps</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {workflow.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {workflow.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {workflow.steps?.length || 0} step(s)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workflow.isActive ? 'Active' : 'Inactive'}
                        color={workflow.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleViewWorkflow(workflow)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(workflow)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={workflow.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(workflow)}
                        >
                          {workflow.isActive ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(workflow.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {workflows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No workflows found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
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
                <Typography variant="h6">Approval Steps</Typography>
                <Button
                  size="small"
                  startIcon={<AddStepIcon />}
                  onClick={addStep}
                >
                  Add Step
                </Button>
              </Box>
            </Grid>

            {formData.steps?.map((step, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" color="primary">
                            Step {step.stepOrder}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeStep(index)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Step Name"
                          value={step.stepName || ''}
                          onChange={(e) => updateStep(index, 'stepName', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Mandatory</InputLabel>
                          <Select
                            value={step.isMandatory ? 'yes' : 'no'}
                            label="Mandatory"
                            onChange={(e) => updateStep(index, 'isMandatory', e.target.value === 'yes')}
                          >
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Condition (Optional)"
                          value={step.condition || ''}
                          onChange={(e) => updateStep(index, 'condition', e.target.value)}
                          placeholder="SpEL expression for conditional approval"
                        />
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
            {selectedWorkflow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Workflow Details</DialogTitle>
        <DialogContent>
          {selectedWorkflow && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                  <Typography variant="h6">{selectedWorkflow.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography>{selectedWorkflow.description || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedWorkflow.isActive ? 'Active' : 'Inactive'}
                    color={selectedWorkflow.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" mb={2}>Approval Steps</Typography>
                  <List>
                    {selectedWorkflow.steps?.map((step, index) => (
                      <React.Fragment key={step.id}>
                        <ListItem>
                          <ListItemText
                            primary={`Step ${step.stepOrder}: ${step.stepName || 'Unnamed Step'}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  Role: {step.approverRoleName || 'N/A'}
                                  {' | '}
                                  User: {step.approverUserName || 'N/A'}
                                  {' | '}
                                  Mandatory: {step.isMandatory ? 'Yes' : 'No'}
                                </Typography>
                                {step.condition && (
                                  <Typography component="div" variant="caption" color="text.secondary">
                                    Condition: {step.condition}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                        {index < selectedWorkflow.steps.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                    {(!selectedWorkflow.steps || selectedWorkflow.steps.length === 0) && (
                      <ListItem>
                        <ListItemText primary="No steps defined" />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowsPage;
