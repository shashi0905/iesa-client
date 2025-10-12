import { Role } from './auth';

export interface UserDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  departmentId?: string;
  departmentName?: string;
  roles: Role[];
  isActive: boolean;
  accountLocked: boolean;
  createdAt: string;
  updatedAt?: string;
  fullName: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  departmentId?: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  departmentId?: string;
  roleIds?: string[];
  isActive?: boolean;
}
