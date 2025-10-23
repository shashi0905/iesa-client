import { apiService as api } from './api';
import {
  Report,
  CreateReportRequest,
  UpdateReportRequest,
  ReportExecutionResult,
} from '../types';

export const reportService = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get('/reports');
    return response.data;
  },

  getReportById: async (id: string): Promise<Report> => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  getReportsByTemplate: async (templateId: string): Promise<Report[]> => {
    const response = await api.get(`/reports/template/${templateId}`);
    return response.data;
  },

  getFavoriteReports: async (): Promise<Report[]> => {
    const response = await api.get('/reports/favorites');
    return response.data;
  },

  createReport: async (data: CreateReportRequest): Promise<Report> => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  updateReport: async (id: string, data: UpdateReportRequest): Promise<Report> => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  executeReport: async (id: string): Promise<ReportExecutionResult> => {
    const response = await api.post(`/reports/${id}/execute`);
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<Report> => {
    const response = await api.put(`/reports/${id}/favorite`);
    return response.data;
  },
};
