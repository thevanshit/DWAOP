import { BaseRepository } from '@/core/repository';

/**
 * Dashboard repository stub.
 * Dashboard data is derived from multiple sources (workflows, attendance, marks, users).
 * This repository is a placeholder for future direct database queries that may
 * aggregate data across tables for dashboard statistics.
 */
export class DashboardRepository extends BaseRepository {
  // Future dashboard-specific database operations will be added here.
  // Currently, dashboard data is provided by the DashboardService using
  // the WorkflowEngine and other existing services.
}
