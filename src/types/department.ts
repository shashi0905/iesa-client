export interface DepartmentDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  managerId?: string;
  managerName?: string;
  costCenter?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
  managerId?: string;
  costCenter?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  parentDepartmentId?: string;
  managerId?: string;
  costCenter?: string;
  isActive?: boolean;
}
