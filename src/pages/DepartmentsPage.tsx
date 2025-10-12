import React, { useEffect, useState } from 'react';
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { departmentService } from '../services/departmentService';
import { DepartmentDto, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

const DepartmentsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDto | null>(null);
  const [formData, setFormData] = useState<Partial<CreateDepartmentRequest>>({
    name: '',
    code: '',
    description: '',
    parentDepartmentId: '',
    managerId: '',
    costCenter: '',
  });

  const canCreate = hasPermission('DEPARTMENT_CREATE');
  const canUpdate = hasPermission('DEPARTMENT_UPDATE');
  const canDelete = hasPermission('DEPARTMENT_DELETE');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load departments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (department?: DepartmentDto) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        name: department.name,
        code: department.code,
        description: department.description,
        parentDepartmentId: department.parentDepartmentId,
        managerId: department.managerId,
        costCenter: department.costCenter,
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        parentDepartmentId: '',
        managerId: '',
        costCenter: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDepartment(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      parentDepartmentId: '',
      managerId: '',
      costCenter: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingDepartment) {
        await departmentService.updateDepartment(
          editingDepartment.id,
          formData as UpdateDepartmentRequest
        );
      } else {
        await departmentService.createDepartment(formData as CreateDepartmentRequest);
      }
      handleCloseDialog();
      loadDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save department');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        loadDepartments();
      } catch (err: any) {
        setError('Failed to delete department');
      }
    }
  };

  const handleToggleActive = async (department: DepartmentDto) => {
    try {
      if (department.isActive) {
        await departmentService.deactivateDepartment(department.id);
      } else {
        await departmentService.activateDepartment(department.id);
      }
      loadDepartments();
    } catch (err: any) {
      setError('Failed to toggle department status');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Departments</Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Department
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>Cost Center</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>{dept.code}</TableCell>
                    <TableCell>{dept.description || '-'}</TableCell>
                    <TableCell>{dept.parentDepartmentName || '-'}</TableCell>
                    <TableCell>{dept.managerName || '-'}</TableCell>
                    <TableCell>{dept.costCenter || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={dept.isActive ? 'Active' : 'Inactive'}
                        color={dept.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {canUpdate && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(dept)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canUpdate && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(dept)}
                          title={dept.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {dept.isActive ? <InactiveIcon /> : <ActiveIcon />}
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(dept.id)}
                          title="Delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDepartment ? 'Edit Department' : 'Create Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Code"
              fullWidth
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="Cost Center"
              fullWidth
              value={formData.costCenter}
              onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDepartment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentsPage;
