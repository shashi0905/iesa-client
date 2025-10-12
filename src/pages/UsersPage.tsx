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
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import { userService } from '../services/userService';
import { UserDto, CreateUserRequest, UpdateUserRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

const UsersPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [formData, setFormData] = useState<Partial<CreateUserRequest>>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    departmentId: '',
    roleIds: [],
  });

  const canCreate = hasPermission('USER_CREATE');
  const canUpdate = hasPermission('USER_UPDATE');
  const canDelete = hasPermission('USER_DELETE');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: UserDto) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        departmentId: user.departmentId,
        roleIds: user.roles.map(r => r.id),
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        departmentId: '',
        roleIds: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      departmentId: '',
      roleIds: [],
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData as UpdateUserRequest);
      } else {
        await userService.createUser(formData as CreateUserRequest);
      }
      handleCloseDialog();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (err: any) {
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleLock = async (user: UserDto) => {
    try {
      if (user.accountLocked) {
        await userService.unlockUser(user.id);
      } else {
        await userService.lockUser(user.id);
      }
      loadUsers();
    } catch (err: any) {
      setError('Failed to toggle lock status');
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
        <Typography variant="h4">Users</Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
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
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.departmentName || '-'}</TableCell>
                    <TableCell>
                      {user.roles.map((role) => (
                        <Chip
                          key={role.id}
                          label={role.name}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                      />
                      {user.accountLocked && (
                        <Chip
                          label="Locked"
                          color="error"
                          size="small"
                          sx={{ ml: 0.5 }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {canUpdate && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canUpdate && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleLock(user)}
                          title={user.accountLocked ? 'Unlock' : 'Lock'}
                        >
                          {user.accountLocked ? <LockOpenIcon /> : <LockIcon />}
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id)}
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
        <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!editingUser && (
              <TextField
                label="Username"
                fullWidth
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            )}
            {!editingUser && (
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="First Name"
              fullWidth
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
