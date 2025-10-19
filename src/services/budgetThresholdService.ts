import { apiService as api } from './api';
import {
  BudgetThreshold,
  CreateThresholdRequest,
  UpdateThresholdRequest,
} from '../types';

export const budgetThresholdService = {
  getAllThresholds: async (): Promise<BudgetThreshold[]> => {
    const response = await api.get('/budget-thresholds');
    return response.data;
  },

  getThresholdById: async (id: string): Promise<BudgetThreshold> => {
    const response = await api.get(`/budget-thresholds/${id}`);
    return response.data;
  },

  getThresholdsByBudget: async (budgetId: string): Promise<BudgetThreshold[]> => {
    const response = await api.get(`/budget-thresholds/budget/${budgetId}`);
    return response.data;
  },

  getEnabledThresholds: async (): Promise<BudgetThreshold[]> => {
    const response = await api.get('/budget-thresholds/enabled');
    return response.data;
  },

  createThreshold: async (data: CreateThresholdRequest): Promise<BudgetThreshold> => {
    const response = await api.post('/budget-thresholds', data);
    return response.data;
  },

  updateThreshold: async (
    id: string,
    data: UpdateThresholdRequest
  ): Promise<BudgetThreshold> => {
    const response = await api.put(`/budget-thresholds/${id}`, data);
    return response.data;
  },

  deleteThreshold: async (id: string): Promise<void> => {
    await api.delete(`/budget-thresholds/${id}`);
  },

  enableThreshold: async (id: string): Promise<BudgetThreshold> => {
    const response = await api.put(`/budget-thresholds/${id}/enable`);
    return response.data;
  },

  disableThreshold: async (id: string): Promise<BudgetThreshold> => {
    const response = await api.put(`/budget-thresholds/${id}/disable`);
    return response.data;
  },

  addNotificationRecipient: async (
    id: string,
    userId: string
  ): Promise<BudgetThreshold> => {
    const response = await api.post(`/budget-thresholds/${id}/recipients/${userId}`);
    return response.data;
  },

  removeNotificationRecipient: async (
    id: string,
    userId: string
  ): Promise<BudgetThreshold> => {
    const response = await api.delete(`/budget-thresholds/${id}/recipients/${userId}`);
    return response.data;
  },

  checkThresholdBreached: async (id: string): Promise<boolean> => {
    const response = await api.get(`/budget-thresholds/${id}/breached`);
    return response.data;
  },
};
