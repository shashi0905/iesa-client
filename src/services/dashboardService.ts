import { apiService as api } from './api';
import {
  Dashboard,
  CreateDashboardRequest,
  UpdateDashboardRequest,
  DashboardWidget,
  CreateDashboardWidgetRequest,
  UpdateDashboardWidgetRequest,
} from '../types';

export const dashboardService = {
  // Dashboard operations
  getAllDashboards: async (): Promise<Dashboard[]> => {
    const response = await api.get('/dashboards');
    return response.data;
  },

  getDashboardById: async (id: string): Promise<Dashboard> => {
    const response = await api.get(`/dashboards/${id}`);
    return response.data;
  },

  getDefaultDashboard: async (): Promise<Dashboard | null> => {
    const response = await api.get('/dashboards/default');
    return response.data;
  },

  getSharedDashboards: async (): Promise<Dashboard[]> => {
    const response = await api.get('/dashboards/shared');
    return response.data;
  },

  createDashboard: async (data: CreateDashboardRequest): Promise<Dashboard> => {
    const response = await api.post('/dashboards', data);
    return response.data;
  },

  updateDashboard: async (
    id: string,
    data: UpdateDashboardRequest
  ): Promise<Dashboard> => {
    const response = await api.put(`/dashboards/${id}`, data);
    return response.data;
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await api.delete(`/dashboards/${id}`);
  },

  setDefaultDashboard: async (id: string): Promise<Dashboard> => {
    const response = await api.put(`/dashboards/${id}/set-default`);
    return response.data;
  },

  shareDashboard: async (id: string): Promise<Dashboard> => {
    const response = await api.put(`/dashboards/${id}/share`);
    return response.data;
  },

  unshareDashboard: async (id: string): Promise<Dashboard> => {
    const response = await api.put(`/dashboards/${id}/unshare`);
    return response.data;
  },

  // Widget operations
  getWidgetsByDashboard: async (dashboardId: string): Promise<DashboardWidget[]> => {
    const response = await api.get(`/dashboard-widgets/dashboard/${dashboardId}`);
    return response.data;
  },

  getWidgetById: async (id: string): Promise<DashboardWidget> => {
    const response = await api.get(`/dashboard-widgets/${id}`);
    return response.data;
  },

  createWidget: async (
    data: CreateDashboardWidgetRequest
  ): Promise<DashboardWidget> => {
    const response = await api.post('/dashboard-widgets', data);
    return response.data;
  },

  updateWidget: async (
    id: string,
    data: UpdateDashboardWidgetRequest
  ): Promise<DashboardWidget> => {
    const response = await api.put(`/dashboard-widgets/${id}`, data);
    return response.data;
  },

  deleteWidget: async (id: string): Promise<void> => {
    await api.delete(`/dashboard-widgets/${id}`);
  },
};
