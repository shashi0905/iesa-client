import { apiService } from './api';
import { DepartmentDto, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types';

export const departmentService = {
  getAllDepartments: (): Promise<DepartmentDto[]> => {
    return apiService.get<DepartmentDto[]>('/departments');
  },

  getDepartmentById: (id: string): Promise<DepartmentDto> => {
    return apiService.get<DepartmentDto>(`/departments/${id}`);
  },

  getRootDepartments: (): Promise<DepartmentDto[]> => {
    return apiService.get<DepartmentDto[]>('/departments/root');
  },

  getChildDepartments: (id: string): Promise<DepartmentDto[]> => {
    return apiService.get<DepartmentDto[]>(`/departments/${id}/children`);
  },

  getActiveDepartments: (): Promise<DepartmentDto[]> => {
    return apiService.get<DepartmentDto[]>('/departments/active');
  },

  createDepartment: (department: CreateDepartmentRequest): Promise<DepartmentDto> => {
    return apiService.post<DepartmentDto>('/departments', department);
  },

  updateDepartment: (id: string, department: UpdateDepartmentRequest): Promise<DepartmentDto> => {
    return apiService.put<DepartmentDto>(`/departments/${id}`, department);
  },

  deleteDepartment: (id: string): Promise<void> => {
    return apiService.delete<void>(`/departments/${id}`);
  },

  activateDepartment: (id: string): Promise<void> => {
    return apiService.post<void>(`/departments/${id}/activate`);
  },

  deactivateDepartment: (id: string): Promise<void> => {
    return apiService.post<void>(`/departments/${id}/deactivate`);
  },
};
