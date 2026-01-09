import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Report, DepartmentStat } from '../types/api';

interface DepartmentChartProps {
    reports?: Report[];
    stats?: DepartmentStat[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#F472B6', '#8B5CF6'];

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ reports, stats }) => {
    const data = useMemo(() => {
        if (stats) {
            return stats.map(stat => ({
                name: stat.department,
                value: stat.amount > 0 ? stat.amount : stat.count,
                type: stat.amount > 0 ? 'amount' : 'count'
            })).sort((a, b) => b.value - a.value);
        }

        if (reports) {
            const deptMap = new Map<string, number>();

            reports.forEach(report => {
                // API returns amount as a number, not string
                const amount = typeof report.amount === 'number' ? report.amount : parseInt(String(report.amount).replace(/[^0-9]/g, ''), 10);
                const currentAmount = deptMap.get(report.department) || 0;
                deptMap.set(report.department, currentAmount + amount);
            });

            return Array.from(deptMap.entries())
                .map(([name, value]) => ({ name, value, type: 'amount' }))
                .sort((a, b) => b.value - a.value); // Sort by value descending
        }

        return [];
    }, [reports, stats]);

    const totalAmount = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    const formatValue = (value: number, type: string) => {
        if (type === 'amount') {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(value);
        }
        return value.toLocaleString('en-IN');
    };

    if (data.length === 0) {
        return (
            <div className="card chart-card">
                <h3 className="chart-title">Corruption by Department</h3>
                <div className="chart-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-secondary)' }}>
                    No Data Available
                </div>
            </div>
        );
    }

    return (
        <div className="card chart-card">
            <h3 className="chart-title">Corruption by Department</h3>

            <div className="chart-content">
                {/* Chart Section */}
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined, _name: any, props: any) => [
                                    formatValue(value || 0, props.payload.type),
                                    props.payload.type === 'amount' ? 'Amount' : 'Reports'
                                ]}
                                contentStyle={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text-primary)'
                                }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="chart-center-text">
                        <div className="chart-total-label">Total</div>
                        <div className="chart-total-value">
                            {formatValue(totalAmount, data.length > 0 ? data[0].type : 'amount')}
                        </div>
                    </div>
                </div>

                {/* Legend Section */}
                <div className="chart-legend">
                    <div className="legend-list">
                        {data.map((entry, index) => (
                            <div key={entry.name} className="legend-item group">
                                <div className="legend-label-group">
                                    <div
                                        className="legend-color"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="legend-label">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="legend-value">
                                    {formatValue(entry.value, entry.type)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="legend-footer">
                        <span className="legend-label">Total Reported</span>
                        <span className="legend-value">
                            {formatValue(totalAmount, data.length > 0 ? data[0].type : 'amount')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
