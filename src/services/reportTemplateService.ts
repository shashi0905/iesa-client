import { apiService as api } from './api';
import {
  ReportTemplate,
  CreateReportTemplateRequest,
  UpdateReportTemplateRequest,
  ReportType,
} from '../types';

export const reportTemplateService = {
  getAllTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await api.get('/report-templates');
    return response.data;
  },

  getTemplateById: async (id: string): Promise<ReportTemplate> => {
    const response = await api.get(`/report-templates/${id}`);
    return response.data;
  },

  getTemplatesByType: async (reportType: ReportType): Promise<ReportTemplate[]> => {
    const response = await api.get(`/report-templates/type/${reportType}`);
    return response.data;
  },

  getSystemTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await api.get('/report-templates/system');
    return response.data;
  },

  getActiveTemplates: async (): Promise<ReportTemplate[]> => {
    const response = await api.get('/report-templates/active');
    return response.data;
  },

  createTemplate: async (data: CreateReportTemplateRequest): Promise<ReportTemplate> => {
    const response = await api.post('/report-templates', data);
    return response.data;
  },

  updateTemplate: async (
    id: string,
    data: UpdateReportTemplateRequest
  ): Promise<ReportTemplate> => {
    const response = await api.put(`/report-templates/${id}`, data);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/report-templates/${id}`);
  },

  activateTemplate: async (id: string): Promise<ReportTemplate> => {
    const response = await api.put(`/report-templates/${id}/activate`);
    return response.data;
  },

  deactivateTemplate: async (id: string): Promise<ReportTemplate> => {
    const response = await api.put(`/report-templates/${id}/deactivate`);
    return response.data;
  },
};
