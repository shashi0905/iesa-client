import { apiService } from './api';
import { Role } from '../types';

export const roleService = {
  getAllRoles: (): Promise<Role[]> => {
    return apiService.get<Role[]>('/roles');
  },

  getRoleById: (id: string): Promise<Role> => {
    return apiService.get<Role>(`/roles/${id}`);
  },
};
