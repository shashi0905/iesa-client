import { apiService } from './api';
import { Comment, CreateCommentRequest } from '../types';

export const commentService = {
  // Get comments for an expense
  getForExpense: async (expenseId: string): Promise<Comment[]> => {
    return apiService.get<Comment[]>(`/comments/expense/${expenseId}`);
  },

  // Get external comments for an expense
  getExternalForExpense: async (expenseId: string): Promise<Comment[]> => {
    return apiService.get<Comment[]>(`/comments/expense/${expenseId}/external`);
  },

  // Get internal comments for an expense
  getInternalForExpense: async (expenseId: string): Promise<Comment[]> => {
    return apiService.get<Comment[]>(`/comments/expense/${expenseId}/internal`);
  },

  // Get comment by ID
  getById: async (id: string): Promise<Comment> => {
    return apiService.get<Comment>(`/comments/${id}`);
  },

  // Create comment
  create: async (data: CreateCommentRequest): Promise<Comment> => {
    return apiService.post<Comment>('/comments', data);
  },

  // Delete comment
  delete: async (id: string): Promise<void> => {
    return apiService.delete(`/comments/${id}`);
  },
};
