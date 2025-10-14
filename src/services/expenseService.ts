import { apiService } from './api';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types';

export const expenseService = {
  // Get all expenses
  getAll: async (): Promise<Expense[]> => {
    return apiService.get<Expense[]>('/expenses');
  },

  // Get expense by ID
  getById: async (id: string): Promise<Expense> => {
    return apiService.get<Expense>(`/expenses/${id}`);
  },

  // Get expenses by submitter
  getBySubmitter: async (submitterId: string): Promise<Expense[]> => {
    return apiService.get<Expense[]>(`/expenses/submitter/${submitterId}`);
  },

  // Get expenses by status
  getByStatus: async (status: string): Promise<Expense[]> => {
    return apiService.get<Expense[]>(`/expenses/status/${status}`);
  },

  // Get pending approvals
  getPendingApprovals: async (): Promise<Expense[]> => {
    return apiService.get<Expense[]>('/expenses/pending-approvals');
  },

  // Create expense
  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    return apiService.post<Expense>('/expenses', data);
  },

  // Update expense
  update: async (id: string, data: UpdateExpenseRequest): Promise<Expense> => {
    return apiService.put<Expense>(`/expenses/${id}`, data);
  },

  // Delete expense
  delete: async (id: string): Promise<void> => {
    return apiService.delete(`/expenses/${id}`);
  },

  // Submit expense
  submit: async (id: string): Promise<Expense> => {
    return apiService.post<Expense>(`/expenses/${id}/submit`);
  },

  // Approve expense
  approve: async (id: string): Promise<Expense> => {
    return apiService.post<Expense>(`/expenses/${id}/approve`);
  },

  // Reject expense
  reject: async (id: string, reason: string): Promise<Expense> => {
    return apiService.post<Expense>(`/expenses/${id}/reject`, { reason });
  },
};
