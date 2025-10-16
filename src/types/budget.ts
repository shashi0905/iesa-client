export enum BudgetPeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export interface Budget {
  id: string;
  name: string;
  segmentId?: string;
  segmentName?: string;
  departmentId?: string;
  departmentName?: string;
  period: string;
  startDate: string;
  endDate: string;
  allocatedAmount: number;
  consumedAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BudgetThreshold {
  id: string;
  budgetId: string;
  percentage: number;
  alertEnabled: boolean;
  notificationRecipientIds?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  budgetName: string;
  thresholdId: string;
  thresholdPercentage: number;
  triggeredDate: string;
  message: string;
  isAcknowledged: boolean;
  acknowledgedDate?: string;
  createdAt: string;
}

export interface CreateBudgetRequest {
  name: string;
  segmentId?: string;
  departmentId?: string;
  period: string;
  startDate: string;
  endDate: string;
  allocatedAmount: number;
}

export interface UpdateBudgetRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  allocatedAmount?: number;
}

export interface CreateThresholdRequest {
  budgetId: string;
  percentage: number;
  alertEnabled: boolean;
  notificationRecipientIds?: string[];
}

export interface UpdateThresholdRequest {
  percentage?: number;
  alertEnabled?: boolean;
}
