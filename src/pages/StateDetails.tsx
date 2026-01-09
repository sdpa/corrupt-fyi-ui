import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StateMap } from '../components/StateMap';
import { DepartmentChart } from '../components/DepartmentChart';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { api } from '../services/api';
import type { StateSummaryStats } from '../types/api';
import { INDIAN_STATES } from '../data/constants';

// Register modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export const StateDetails: React.FC = () => {
    const { stateCode } = useParams<{ stateCode: string }>();

    // Find state name from code
    const stateEntry = React.useMemo(() =>
        INDIAN_STATES.find(s => s.code === stateCode),
        [stateCode]);

    const stateName = stateEntry ? stateEntry.name : stateCode;

    const [summaryStats, setSummaryStats] = useState<StateSummaryStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const lastFetchedState = React.useRef<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!stateCode) return;
            if (lastFetchedState.current === stateCode) return;
            lastFetchedState.current = stateCode;

            try {
                // Fetch summary
                const summaryResponse = await api.getStateSummary(stateCode);
                setSummaryStats(summaryResponse);
            } catch (error) {
                console.error('Error fetching state data:', error);
                setError('Failed to load state data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [stateCode]);

    const formatLargeCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(1)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)} L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)} K`;
        }
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate derived stats
    const mostCorruptDept = React.useMemo(() => {
        if (!summaryStats?.corruption_by_departments) return 'N/A';
        const entries = Object.entries(summaryStats.corruption_by_departments);
        if (entries.length === 0) return 'N/A';
        return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }, [summaryStats]);

    const departmentStats = React.useMemo(() => {
        if (!summaryStats?.corruption_by_departments) return [];
        return Object.entries(summaryStats.corruption_by_departments).map(([dept, count]) => ({
            department: dept,
            count: count,
            amount: 0 // API only returns count, so we set amount to 0 or use count as value
        }));
    }, [summaryStats]);

    if (isLoading) {
        return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Loading state data...</div>;
    }

    if (error || !summaryStats) {
        return <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error || 'State not found'}</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">{stateName} Corruption Report</h1>
                <p className="page-subtitle">Detailed analysis and user reports for {stateName}</p>
            </div>

            <div className="details-grid">
                {/* Left Column: State Map */}
                <div className="map-container">
                    <StateMap stateName={stateName || ''} corruptionLevel={68} />
                </div>

                {/* Right Column: State Metrics & Chart */}
                <div className="metrics-section">
                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-title">Total Reports</div>
                            <div className="metric-value">{summaryStats.total_reports}</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Total Amount</div>
                            <div className="metric-value">{formatLargeCurrency(summaryStats.total_amount)}</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Most Corrupt Dept</div>
                            <div className="metric-value">{mostCorruptDept}</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Avg Bribe</div>
                            <div className="metric-value">{formatLargeCurrency(summaryStats.avg_bribe)}</div>
                        </div>
                    </div>

                    {/* Department Chart */}
                    <DepartmentChart stats={departmentStats} />
                </div>

            </div>
        </div>
    );
};
