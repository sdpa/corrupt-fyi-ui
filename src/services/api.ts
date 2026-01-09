import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
    Report,
    NewReportInput,
    ReportListResponse,
    SummaryStats,
    HeatmapEntry,
    GetReportsParams,
    ValidationError,
    ApiError,
    StateSummaryStats
} from '../types/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ValidationError | ApiError>) => {
                if (error.response) {
                    // Server responded with error status
                    console.error('API Error:', error.response.data);
                } else if (error.request) {
                    // Request made but no response
                    console.error('Network Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    // Reports API
    async getReports(params?: GetReportsParams): Promise<ReportListResponse> {
        const response = await this.client.get<ReportListResponse>('/v1/reports', {
            params,
        });
        return response.data;
    }

    async getAllReports(): Promise<Report[]> {
        const response = await this.client.get<Report[]>('/v1/reports/all');
        return response.data;
    }

    async deleteAllReports(): Promise<void> {
        await this.client.delete('/v1/reports/all');
    }

    async createReport(data: NewReportInput): Promise<Report> {
        const response = await this.client.post<Report>('/v1/reports', data);
        return response.data;
    }

    // Statistics API
    async getSummaryStats(): Promise<SummaryStats> {
        const response = await this.client.get<SummaryStats>('/v1/stats/summary');
        return response.data;
    }

    async getHeatmapData(): Promise<HeatmapEntry[]> {
        const response = await this.client.get<HeatmapEntry[]>('/v1/stats/heatmap');
        return response.data;
    }

    async getStateSummary(stateCode: string): Promise<StateSummaryStats> {
        const response = await this.client.get<StateSummaryStats>(`/v1/stats/state/${stateCode}/summary`);
        return response.data;
    }

    async getDistricts(stateCode: string): Promise<string[]> {
        const response = await this.client.get<string[]>(`/v1/states/${stateCode}/districts`);
        return response.data;
    }

    // Health check
    async checkHealth(): Promise<{ status: string; timestamp: string; service: string }> {
        const response = await this.client.get('/health');
        return response.data;
    }
}

// Export singleton instance
export const api = new ApiClient();
