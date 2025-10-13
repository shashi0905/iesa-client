import { apiService } from './api';
import { Segment, CreateSegmentRequest, UpdateSegmentRequest, SegmentType } from '../types';

export const segmentService = {
  // Get all segments
  getAll: async (): Promise<Segment[]> => {
    return apiService.get<Segment[]>('/segments');
  },

  // Get all active segments
  getAllActive: async (): Promise<Segment[]> => {
    return apiService.get<Segment[]>('/segments/active');
  },

  // Get root segments
  getRootSegments: async (): Promise<Segment[]> => {
    return apiService.get<Segment[]>('/segments/roots');
  },

  // Get segment by ID
  getById: async (id: string): Promise<Segment> => {
    return apiService.get<Segment>(`/segments/${id}`);
  },

  // Get segment by code
  getByCode: async (code: string): Promise<Segment> => {
    return apiService.get<Segment>(`/segments/code/${code}`);
  },

  // Get segments by type
  getByType: async (type: SegmentType): Promise<Segment[]> => {
    return apiService.get<Segment[]>(`/segments/type/${type}`);
  },

  // Get child segments
  getChildren: async (parentId: string): Promise<Segment[]> => {
    return apiService.get<Segment[]>(`/segments/${parentId}/children`);
  },

  // Search segments
  search: async (query: string): Promise<Segment[]> => {
    return apiService.get<Segment[]>(`/segments/search`, { params: { q: query } });
  },

  // Create segment
  create: async (data: CreateSegmentRequest): Promise<Segment> => {
    return apiService.post<Segment>('/segments', data);
  },

  // Update segment
  update: async (id: string, data: UpdateSegmentRequest): Promise<Segment> => {
    return apiService.put<Segment>(`/segments/${id}`, data);
  },

  // Delete segment
  delete: async (id: string): Promise<void> => {
    return apiService.delete(`/segments/${id}`);
  },

  // Activate segment
  activate: async (id: string): Promise<Segment> => {
    return apiService.post<Segment>(`/segments/${id}/activate`);
  },

  // Deactivate segment
  deactivate: async (id: string): Promise<Segment> => {
    return apiService.post<Segment>(`/segments/${id}/deactivate`);
  },
};
