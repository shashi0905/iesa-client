export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export interface SegmentAllocation {
  id: string;
  segmentId: string;
  segmentName: string;
  segmentCode: string;
  amount: number;
  percentage: number;
  description?: string;
}

export interface Document {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  uploadDate: string;
  uploadedById: string;
  uploadedByName: string;
}

export interface Expense {
  id: string;
  submitterId: string;
  submitterName: string;
  expenseDate: string;
  vendor?: string;
  totalAmount: number;
  currency: string;
  description?: string;
  status: string;
  submissionDate?: string;
  approvalDate?: string;
  rejectionReason?: string;
  segmentAllocations: SegmentAllocation[];
  documents: Document[];
  createdAt: string;
  updatedAt?: string;
}

export interface SegmentAllocationRequest {
  segmentId: string;
  percentage: number;
  description?: string;
}

export interface CreateExpenseRequest {
  expenseDate: string;
  vendor?: string;
  totalAmount: number;
  currency: string;
  description?: string;
  segmentAllocations: SegmentAllocationRequest[];
}

export interface UpdateExpenseRequest {
  expenseDate?: string;
  vendor?: string;
  totalAmount?: number;
  currency?: string;
  description?: string;
  segmentAllocations?: SegmentAllocationRequest[];
}
