export enum SegmentType {
  COST_CENTER = 'COST_CENTER',
  PROJECT = 'PROJECT',
  CATEGORY = 'CATEGORY',
  DEPARTMENT = 'DEPARTMENT',
  LOCATION = 'LOCATION',
}

export interface Segment {
  id: string;
  name: string;
  code: string;
  description?: string;
  segmentType: SegmentType;
  parentSegmentId?: string;
  parentSegmentName?: string;
  fullPath: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: Record<string, any>;
  isRoot: boolean;
  isLeaf: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSegmentRequest {
  name: string;
  code: string;
  description?: string;
  segmentType: string;
  parentSegmentId?: string;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

export interface UpdateSegmentRequest {
  name?: string;
  description?: string;
  segmentType?: string;
  parentSegmentId?: string;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, any>;
}
