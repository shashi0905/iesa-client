import { apiService } from './api';
import { WorkflowHistory } from '../types';

export const workflowHistoryService = {
  // Get history for an expense
  getForExpense: async (expenseId: string): Promise<WorkflowHistory[]> => {
    return apiService.get<WorkflowHistory[]>(`/workflow-history/expense/${expenseId}`);
  },

  // Get latest history for an expense
  getLatestForExpense: async (expenseId: string): Promise<WorkflowHistory> => {
    return apiService.get<WorkflowHistory>(`/workflow-history/expense/${expenseId}/latest`);
  },

  // Get history by actor
  getByActor: async (actorId: string): Promise<WorkflowHistory[]> => {
    return apiService.get<WorkflowHistory[]>(`/workflow-history/actor/${actorId}`);
  },

  // Get approval transitions
  getApprovalTransitions: async (): Promise<WorkflowHistory[]> => {
    return apiService.get<WorkflowHistory[]>('/workflow-history/approvals');
  },

  // Get rejection transitions
  getRejectionTransitions: async (): Promise<WorkflowHistory[]> => {
    return apiService.get<WorkflowHistory[]>('/workflow-history/rejections');
  },
};
