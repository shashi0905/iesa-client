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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  FolderSpecial as SegmentIcon,
} from '@mui/icons-material';
import { segmentService } from '../services/segmentService';
import { Segment, SegmentType, CreateSegmentRequest, UpdateSegmentRequest } from '../types';

const SegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [formData, setFormData] = useState<CreateSegmentRequest>({
    name: '',
    code: '',
    description: '',
    segmentType: SegmentType.CATEGORY,
    displayOrder: 0,
  });

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await segmentService.getAll();
      setSegments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (segment?: Segment) => {
    if (segment) {
      setEditingSegment(segment);
      setFormData({
        name: segment.name,
        code: segment.code,
        description: segment.description || '',
        segmentType: segment.segmentType,
        parentSegmentId: segment.parentSegmentId,
        displayOrder: segment.displayOrder,
      });
    } else {
      setEditingSegment(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        segmentType: SegmentType.CATEGORY,
        displayOrder: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSegment(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      segmentType: SegmentType.CATEGORY,
      displayOrder: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (editingSegment) {
        const updateData: UpdateSegmentRequest = {
          name: formData.name,
          description: formData.description,
          segmentType: formData.segmentType,
          parentSegmentId: formData.parentSegmentId,
          displayOrder: formData.displayOrder,
        };
        await segmentService.update(editingSegment.id, updateData);
      } else {
        await segmentService.create(formData);
      }
      handleCloseDialog();
      loadSegments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save segment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) {
      return;
    }

    try {
      setError('');
      await segmentService.delete(id);
      loadSegments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete segment');
    }
  };

  const handleToggleActive = async (segment: Segment) => {
    try {
      setError('');
      if (segment.isActive) {
        await segmentService.deactivate(segment.id);
      } else {
        await segmentService.activate(segment.id);
      }
      loadSegments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update segment status');
    }
  };

  const getSegmentTypeColor = (type: SegmentType): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
    switch (type) {
      case SegmentType.COST_CENTER:
        return 'primary';
      case SegmentType.PROJECT:
        return 'secondary';
      case SegmentType.CATEGORY:
        return 'success';
      case SegmentType.DEPARTMENT:
        return 'warning';
      case SegmentType.LOCATION:
        return 'info';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading segments...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <SegmentIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4">Segments</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Segment
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
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Full Path</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Display Order</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {segments.map((segment) => (
                  <TableRow key={segment.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {segment.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{segment.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={segment.segmentType.replace('_', ' ')}
                        color={getSegmentTypeColor(segment.segmentType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {segment.fullPath}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={segment.isActive ? 'Active' : 'Inactive'}
                        color={segment.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{segment.displayOrder}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={segment.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleActive(segment)}
                          color={segment.isActive ? 'primary' : 'default'}
                        >
                          {segment.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(segment)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(segment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {segments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        No segments found. Create your first segment to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSegment ? 'Edit Segment' : 'Create New Segment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Segment Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Segment Code"
              fullWidth
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              disabled={!!editingSegment}
              helperText="Unique code identifier (cannot be changed after creation)"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Segment Type</InputLabel>
              <Select
                value={formData.segmentType}
                label="Segment Type"
                onChange={(e) => setFormData({ ...formData, segmentType: e.target.value as SegmentType })}
              >
                <MenuItem value={SegmentType.COST_CENTER}>Cost Center</MenuItem>
                <MenuItem value={SegmentType.PROJECT}>Project</MenuItem>
                <MenuItem value={SegmentType.CATEGORY}>Category</MenuItem>
                <MenuItem value={SegmentType.DEPARTMENT}>Department</MenuItem>
                <MenuItem value={SegmentType.LOCATION}>Location</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Parent Segment (Optional)</InputLabel>
              <Select
                value={formData.parentSegmentId || ''}
                label="Parent Segment (Optional)"
                onChange={(e) => setFormData({ ...formData, parentSegmentId: e.target.value || undefined })}
              >
                <MenuItem value="">
                  <em>None (Root Segment)</em>
                </MenuItem>
                {segments
                  .filter((s) => !editingSegment || s.id !== editingSegment.id)
                  .map((segment) => (
                    <MenuItem key={segment.id} value={segment.id}>
                      {segment.fullPath}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Display Order"
              type="number"
              fullWidth
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              helperText="Lower numbers appear first"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSegment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SegmentsPage;
