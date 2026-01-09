import React, { useState } from 'react';

export interface Report {
    id: string;
    city: string;
    state: string;
    department: string;
    service: string;
    amount: number;
    date: string; // ISO date string
}

interface DataTableProps {
    data: Report[];
}

type SortField = 'location' | 'department' | 'service' | 'amount' | 'date';
type SortDirection = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to desc for new field
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortField === 'location') {
            aValue = `${a.city}, ${a.state}`;
            bValue = `${b.city}, ${b.state}`;
        } else {
            // @ts-ignore
            aValue = a[sortField];
            // @ts-ignore
            bValue = b[sortField];
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th onClick={() => handleSort('location')} style={headerStyle}>Location {sortIndicator('location', sortField, sortDirection)}</th>
                        <th onClick={() => handleSort('department')} style={headerStyle}>Department {sortIndicator('department', sortField, sortDirection)}</th>
                        <th onClick={() => handleSort('service')} style={headerStyle}>Service {sortIndicator('service', sortField, sortDirection)}</th>
                        <th onClick={() => handleSort('amount')} style={headerStyle}>Amount (INR) {sortIndicator('amount', sortField, sortDirection)}</th>
                        <th onClick={() => handleSort('date')} style={headerStyle}>Date {sortIndicator('date', sortField, sortDirection)}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((report, index) => (
                        <tr key={report.id} style={{
                            backgroundColor: index % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'background-color 0.15s ease-in-out'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--highlight-neutral)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)'}
                        >
                            <td style={cellStyle}>{report.city}, {report.state}</td>
                            <td style={cellStyle}>{report.department}</td>
                            <td style={cellStyle}>{report.service}</td>
                            <td style={{ ...cellStyle, fontFamily: 'var(--font-family)', fontWeight: 500 }}>₹{report.amount.toLocaleString('en-IN')}</td>
                            <td style={cellStyle}>{new Date(report.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 1
};

const cellStyle: React.CSSProperties = {
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)'
};

function sortIndicator(field: SortField, currentField: SortField, direction: SortDirection) {
    if (field !== currentField) return null;
    return <span style={{ marginLeft: '4px', color: 'var(--accent-primary)' }}>{direction === 'asc' ? '↑' : '↓'}</span>;
}
