import { apiService } from './api';
import { ApprovalWorkflow, CreateApprovalWorkflowRequest, UpdateApprovalWorkflowRequest, ApprovalStep } from '../types';

export const approvalWorkflowService = {
  // Get all workflows
  getAll: async (): Promise<ApprovalWorkflow[]> => {
    return apiService.get<ApprovalWorkflow[]>('/workflows');
  },

  // Get all active workflows
  getAllActive: async (): Promise<ApprovalWorkflow[]> => {
    return apiService.get<ApprovalWorkflow[]>('/workflows/active');
  },

  // Get workflow by ID
  getById: async (id: string): Promise<ApprovalWorkflow> => {
    return apiService.get<ApprovalWorkflow>(`/workflows/${id}`);
  },

  // Get workflow by name
  getByName: async (name: string): Promise<ApprovalWorkflow> => {
    return apiService.get<ApprovalWorkflow>(`/workflows/name/${name}`);
  },

  // Create workflow
  create: async (data: CreateApprovalWorkflowRequest): Promise<ApprovalWorkflow> => {
    return apiService.post<ApprovalWorkflow>('/workflows', data);
  },

  // Update workflow
  update: async (id: string, data: UpdateApprovalWorkflowRequest): Promise<ApprovalWorkflow> => {
    return apiService.put<ApprovalWorkflow>(`/workflows/${id}`, data);
  },

  // Delete workflow
  delete: async (id: string): Promise<void> => {
    return apiService.delete(`/workflows/${id}`);
  },

  // Activate workflow
  activate: async (id: string): Promise<ApprovalWorkflow> => {
    return apiService.post<ApprovalWorkflow>(`/workflows/${id}/activate`);
  },

  // Deactivate workflow
  deactivate: async (id: string): Promise<ApprovalWorkflow> => {
    return apiService.post<ApprovalWorkflow>(`/workflows/${id}/deactivate`);
  },

  // Get workflow steps
  getSteps: async (id: string): Promise<ApprovalStep[]> => {
    return apiService.get<ApprovalStep[]>(`/workflows/${id}/steps`);
  },

  // Get mandatory steps
  getMandatorySteps: async (id: string): Promise<ApprovalStep[]> => {
    return apiService.get<ApprovalStep[]>(`/workflows/${id}/steps/mandatory`);
  },
};
