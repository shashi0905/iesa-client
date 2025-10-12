import { apiService } from './api';
import { UserDto, CreateUserRequest, UpdateUserRequest } from '../types';

export const userService = {
  getAllUsers: (): Promise<UserDto[]> => {
    return apiService.get<UserDto[]>('/users');
  },

  getUserById: (id: string): Promise<UserDto> => {
    return apiService.get<UserDto>(`/users/${id}`);
  },

  getUsersByDepartment: (departmentId: string): Promise<UserDto[]> => {
    return apiService.get<UserDto[]>(`/users/department/${departmentId}`);
  },

  getActiveUsers: (): Promise<UserDto[]> => {
    return apiService.get<UserDto[]>('/users/active');
  },

  createUser: (user: CreateUserRequest): Promise<UserDto> => {
    return apiService.post<UserDto>('/users', user);
  },

  updateUser: (id: string, user: UpdateUserRequest): Promise<UserDto> => {
    return apiService.put<UserDto>(`/users/${id}`, user);
  },

  deleteUser: (id: string): Promise<void> => {
    return apiService.delete<void>(`/users/${id}`);
  },

  lockUser: (id: string): Promise<void> => {
    return apiService.post<void>(`/users/${id}/lock`);
  },

  unlockUser: (id: string): Promise<void> => {
    return apiService.post<void>(`/users/${id}/unlock`);
  },
};
