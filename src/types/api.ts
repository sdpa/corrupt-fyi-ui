// API Type Definitions based on OpenAPI specification

export interface Report {
    id: string;
    department: string;
    amount: number;
    state: string;
    district: string | null;
    city: string | null;
    description: string;
    date_reported: string;
}

export interface NewReportInput {
    department: string;
    amount: number;
    state: string;
    district?: string;
    city?: string;
    description: string;
}

export interface ReportListResponse {
    data: Report[];
    total: number;
}

export interface SummaryStats {
    total_corruption_amount: number;
    median_bribe: number;
    most_reported_department: string;
    total_reports: number;
}

export interface HeatmapEntry {
    state_name: string;
    total_amount: number;
    report_count: number;
}

export interface ValidationError {
    error: string;
    details: Array<{
        field: string;
        message: string;
    }>;
}

export interface ApiError {
    error: string;
    message: string;
}

export interface GetReportsParams {
    state?: string;
    department?: string;
    limit?: number;
    offset?: number;
}

export interface DepartmentStat {
    department: string;
    count: number;
    amount: number;
}

export interface StateSummaryStats {
    total_reports: number;
    total_amount: number;
    avg_bribe: number;
    corruption_by_departments: Record<string, number>;
}
