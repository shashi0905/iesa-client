import { apiService as api } from './api';
import { BudgetAlert } from '../types';

export const budgetAlertService = {
  getAllAlerts: async (): Promise<BudgetAlert[]> => {
    const response = await api.get('/budget-alerts');
    return response.data;
  },

  getAlertById: async (id: string): Promise<BudgetAlert> => {
    const response = await api.get(`/budget-alerts/${id}`);
    return response.data;
  },

  getAlertsByBudget: async (budgetId: string): Promise<BudgetAlert[]> => {
    const response = await api.get(`/budget-alerts/budget/${budgetId}`);
    return response.data;
  },

  getUnacknowledgedAlerts: async (): Promise<BudgetAlert[]> => {
    const response = await api.get('/budget-alerts/unacknowledged');
    return response.data;
  },

  getRecentAlerts: async (days: number = 7): Promise<BudgetAlert[]> => {
    const response = await api.get('/budget-alerts/recent', {
      params: { days },
    });
    return response.data;
  },

  acknowledgeAlert: async (id: string): Promise<BudgetAlert> => {
    const response = await api.put(`/budget-alerts/${id}/acknowledge`);
    return response.data;
  },

  deleteAlert: async (id: string): Promise<void> => {
    await api.delete(`/budget-alerts/${id}`);
  },

  deleteAcknowledgedAlerts: async (): Promise<number> => {
    const response = await api.delete('/budget-alerts/acknowledged');
    return response.data;
  },

  deleteOldAlerts: async (days: number = 30): Promise<number> => {
    const response = await api.delete('/budget-alerts/old', {
      params: { days },
    });
    return response.data;
  },

  checkAndCreateAlerts: async (): Promise<number> => {
    const response = await api.post('/budget-alerts/check-and-create');
    return response.data;
  },
};
