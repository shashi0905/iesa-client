export enum ReportType {
  EXPENSE_SUMMARY = 'EXPENSE_SUMMARY',
  SEGMENT_ANALYSIS = 'SEGMENT_ANALYSIS',
  BUDGET_VARIANCE = 'BUDGET_VARIANCE',
  DEPARTMENT_SPENDING = 'DEPARTMENT_SPENDING',
  TOP_SPENDERS = 'TOP_SPENDERS',
  PENDING_APPROVALS = 'PENDING_APPROVALS',
  EXPENSE_AGING = 'EXPENSE_AGING',
  BUDGET_UTILIZATION = 'BUDGET_UTILIZATION',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
}

export enum VisualizationType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  DOUGHNUT = 'DOUGHNUT',
  AREA = 'AREA',
  TABLE = 'TABLE',
  CARD = 'CARD',
}

export enum DimensionType {
  SEGMENT = 'SEGMENT',
  DEPARTMENT = 'DEPARTMENT',
  USER = 'USER',
  CATEGORY = 'CATEGORY',
  TIME_PERIOD = 'TIME_PERIOD',
}

// Report Template interfaces
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType;
  visualizationType: VisualizationType;
  queryDefinition?: string;
  configuration?: Record<string, any>;
  isSystemTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReportTemplateRequest {
  name: string;
  description?: string;
  reportType: ReportType;
  visualizationType: VisualizationType;
  queryDefinition?: string;
  configuration?: Record<string, any>;
}

export interface UpdateReportTemplateRequest {
  name?: string;
  description?: string;
  visualizationType?: VisualizationType;
  queryDefinition?: string;
  configuration?: Record<string, any>;
}

// Report interfaces
export interface Report {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  templateName?: string;
  createdByUserId: string;
  createdByUserName?: string;
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  scheduledCron?: string;
  isFavorite: boolean;
  lastExecutedAt?: string;
  executionCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReportRequest {
  name: string;
  description?: string;
  templateId: string;
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  scheduledCron?: string;
}

export interface UpdateReportRequest {
  name?: string;
  description?: string;
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  scheduledCron?: string;
}

export interface ReportExecutionResult {
  reportId: string;
  reportName: string;
  reportType: ReportType;
  visualizationType: VisualizationType;
  data: any[];
  metadata?: Record<string, any>;
  executedAt: string;
}

// Dashboard interfaces
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName?: string;
  widgets: DashboardWidget[];
  layout?: Record<string, any>;
  isDefault: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDashboardRequest {
  name: string;
  description?: string;
  layout?: Record<string, any>;
  isDefault?: boolean;
  isShared?: boolean;
}

export interface UpdateDashboardRequest {
  name?: string;
  description?: string;
  layout?: Record<string, any>;
  isDefault?: boolean;
  isShared?: boolean;
}

// Dashboard Widget interfaces
export interface DashboardWidget {
  id: string;
  dashboardId: string;
  reportId: string;
  reportName?: string;
  title?: string;
  position?: Record<string, any>;
  refreshInterval?: number;
  width?: number;
  height?: number;
  orderIndex?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDashboardWidgetRequest {
  dashboardId: string;
  reportId: string;
  title?: string;
  position?: Record<string, any>;
  refreshInterval?: number;
  width?: number;
  height?: number;
  orderIndex?: number;
}

export interface UpdateDashboardWidgetRequest {
  title?: string;
  position?: Record<string, any>;
  refreshInterval?: number;
  width?: number;
  height?: number;
  orderIndex?: number;
}

// Analytics Snapshot interfaces
export interface AnalyticsSnapshot {
  id: string;
  snapshotDate: string;
  dimension: DimensionType;
  dimensionValue: string;
  totalExpenses: number;
  expenseCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalBudgetAllocated?: number;
  totalBudgetConsumed?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}
