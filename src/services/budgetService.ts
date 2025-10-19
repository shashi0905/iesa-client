import { apiService as api } from './api';
import {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  BudgetPeriod,
} from '../types';

export const budgetService = {
  getAllBudgets: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets');
    return response.data;
  },

  getAllActiveBudgets: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets/active');
    return response.data;
  },

  getBudgetById: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  getBudgetsBySegment: async (segmentId: string): Promise<Budget[]> => {
    const response = await api.get(`/budgets/segment/${segmentId}`);
    return response.data;
  },

  getBudgetsByDepartment: async (departmentId: string): Promise<Budget[]> => {
    const response = await api.get(`/budgets/department/${departmentId}`);
    return response.data;
  },

  getBudgetsByPeriod: async (period: BudgetPeriod): Promise<Budget[]> => {
    const response = await api.get(`/budgets/period/${period}`);
    return response.data;
  },

  createBudget: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  updateBudget: async (id: string, data: UpdateBudgetRequest): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  activateBudget: async (id: string): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}/activate`);
    return response.data;
  },

  deactivateBudget: async (id: string): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}/deactivate`);
    return response.data;
  },

  updateConsumption: async (id: string, amount: number): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}/consumption`, null, {
      params: { amount },
    });
    return response.data;
  },

  getRemainingAmount: async (id: string): Promise<number> => {
    const response = await api.get(`/budgets/${id}/remaining`);
    return response.data;
  },

  getBudgetUtilization: async (id: string): Promise<number> => {
    const response = await api.get(`/budgets/${id}/utilization`);
    return response.data;
  },

  checkBudgetAvailability: async (
    id: string,
    requestedAmount: number
  ): Promise<boolean> => {
    const response = await api.get(`/budgets/${id}/availability`, {
      params: { requestedAmount },
    });
    return response.data;
  },
};
