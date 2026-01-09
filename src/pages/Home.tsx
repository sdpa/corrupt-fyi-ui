import React, { useEffect, useState } from 'react';
import { IndiaMap } from '../components/IndiaMap';
import { api } from '../services/api';
import type { SummaryStats } from '../types/api';

export const Home: React.FC = () => {
    const [stats, setStats] = useState<SummaryStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = React.useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchStats = async () => {
            try {
                const data = await api.getSummaryStats();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load statistics');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="container">
            <div className="grid-layout">
                {/* Map Section */}
                <div className="map-section">
                    <IndiaMap />
                </div>

                {/* Metrics Section */}
                <div className="metrics-section">
                    {isLoading ? (
                        <>
                            <div className="metric-card" style={{ opacity: 0.6 }}>
                                <div className="metric-title">Loading...</div>
                                <div className="metric-value">--</div>
                            </div>
                            <div className="metric-card" style={{ opacity: 0.6 }}>
                                <div className="metric-title">Loading...</div>
                                <div className="metric-value">--</div>
                            </div>
                            <div className="metric-card" style={{ opacity: 0.6 }}>
                                <div className="metric-title">Loading...</div>
                                <div className="metric-value">--</div>
                            </div>
                        </>
                    ) : error ? (
                        <div className="metric-card" style={{ gridColumn: '1 / -1', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                            <div style={{ color: '#DC2626', fontSize: '0.875rem' }}>{error}</div>
                        </div>
                    ) : stats ? (
                        <>
                            <MetricCard
                                title="Total Corruption Amount"
                                value={formatCurrency(stats.total_corruption_amount)}
                                label={`${stats.total_reports.toLocaleString()} reports`}
                            />
                            <MetricCard
                                title="Median Bribe"
                                value={formatCurrency(stats.median_bribe)}
                                label="Based on all reports"
                            />
                            <MetricCard
                                title="Most Reported"
                                value={stats.most_reported_department}
                                label="Department"
                            />
                        </>
                    ) : null}
                </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                <p>Data is user-reported and not independently verified.</p>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; label: string }> = ({ title, value, label }) => (
    <div className="metric-card">
        <div className="metric-title">{title}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-label">{label}</div>
    </div>
);
