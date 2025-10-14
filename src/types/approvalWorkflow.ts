export enum ApprovalActionType {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELEGATED = 'DELEGATED',
  COMMENTED = 'COMMENTED',
}

export interface ApprovalStep {
  id: string;
  workflowId: string;
  stepOrder: number;
  approverRoleId?: string;
  approverRoleName?: string;
  approverUserId?: string;
  approverUserName?: string;
  condition?: string;
  isMandatory: boolean;
  stepName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: ApprovalStep[];
  triggerConditions?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ApprovalAction {
  id: string;
  expenseId: string;
  stepId?: string;
  stepName?: string;
  approverId: string;
  approverName: string;
  action: string;
  comment?: string;
  actionDate: string;
  delegatedToId?: string;
  delegatedToName?: string;
}

export interface Comment {
  id: string;
  expenseId: string;
  authorId: string;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface WorkflowHistory {
  id: string;
  expenseId: string;
  fromStatus?: string;
  toStatus: string;
  actorId: string;
  actorName: string;
  comment?: string;
  timestamp: string;
}

export interface ApprovalStepRequest {
  stepOrder: number;
  approverRoleId?: string;
  approverUserId?: string;
  condition?: string;
  isMandatory?: boolean;
  stepName?: string;
}

export interface CreateApprovalWorkflowRequest {
  name: string;
  description?: string;
  steps?: ApprovalStepRequest[];
  triggerConditions?: Record<string, any>;
}

export interface UpdateApprovalWorkflowRequest {
  name?: string;
  description?: string;
  steps?: ApprovalStepRequest[];
  triggerConditions?: Record<string, any>;
  isActive?: boolean;
}

export interface CreateCommentRequest {
  expenseId: string;
  content: string;
  isInternal?: boolean;
}

export interface CreateApprovalActionRequest {
  expenseId: string;
  stepId?: string;
  action: string;
  comment?: string;
  delegatedToId?: string;
}
