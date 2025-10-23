import { apiService as api } from './api';
import { AnalyticsSnapshot, DimensionType } from '../types';

export const analyticsService = {
  getSnapshotsByDimension: async (
    dimension: DimensionType,
    startDate: string,
    endDate: string
  ): Promise<AnalyticsSnapshot[]> => {
    const response = await api.get('/analytics/snapshots', {
      params: { dimension, startDate, endDate },
    });
    return response.data;
  },

  getSnapshotByDate: async (
    date: string,
    dimension: DimensionType
  ): Promise<AnalyticsSnapshot[]> => {
    const response = await api.get('/analytics/snapshots/date', {
      params: { date, dimension },
    });
    return response.data;
  },

  getLatestSnapshots: async (
    dimension: DimensionType
  ): Promise<AnalyticsSnapshot[]> => {
    const response = await api.get('/analytics/snapshots/latest', {
      params: { dimension },
    });
    return response.data;
  },

  aggregateBySegment: async (
    snapshotDate: string,
    segmentId: string
  ): Promise<AnalyticsSnapshot> => {
    const response = await api.post('/analytics/aggregate/segment', null, {
      params: { snapshotDate, segmentId },
    });
    return response.data;
  },

  aggregateByDepartment: async (
    snapshotDate: string,
    departmentId: string
  ): Promise<AnalyticsSnapshot> => {
    const response = await api.post('/analytics/aggregate/department', null, {
      params: { snapshotDate, departmentId },
    });
    return response.data;
  },

  aggregateByUser: async (
    snapshotDate: string,
    userId: string
  ): Promise<AnalyticsSnapshot> => {
    const response = await api.post('/analytics/aggregate/user', null, {
      params: { snapshotDate, userId },
    });
    return response.data;
  },
};
