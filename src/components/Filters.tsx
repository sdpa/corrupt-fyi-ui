import React from 'react';

interface FiltersProps {
    onFilterChange: (key: string, value: string) => void;
    onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange, onReset }) => {
    return (
        <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            position: 'sticky',
            top: '80px', // Below the header
            zIndex: 5,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Filter Reports</h3>
                <button onClick={onReset} style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500
                }}>
                    Reset all
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={filterGroupStyle}>
                    <label style={labelStyle}>State</label>
                    <select style={selectStyle} onChange={(e) => onFilterChange('state', e.target.value)}>
                        <option value="">All States</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                </div>

                <div style={filterGroupStyle}>
                    <label style={labelStyle}>Department</label>
                    <select style={selectStyle} onChange={(e) => onFilterChange('department', e.target.value)}>
                        <option value="">All Departments</option>
                        <option value="Police">Police</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Transport">Transport</option>
                        <option value="Municipal">Municipal Corporation</option>
                        <option value="Electricity">Electricity Board</option>
                    </select>
                </div>

                <div style={filterGroupStyle}>
                    <label style={labelStyle}>Amount Range</label>
                    <select style={selectStyle} onChange={(e) => onFilterChange('amountRange', e.target.value)}>
                        <option value="">Any Amount</option>
                        <option value="0-500">₹0 - ₹500</option>
                        <option value="500-2000">₹500 - ₹2,000</option>
                        <option value="2000-10000">₹2,000 - ₹10,000</option>
                        <option value="10000+">₹10,000+</option>
                    </select>
                </div>

                <div style={filterGroupStyle}>
                    <label style={labelStyle}>Date Range</label>
                    <select style={selectStyle} onChange={(e) => onFilterChange('dateRange', e.target.value)}>
                        <option value="">All Time</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-year">Last Year</option>
                        <option value="older">Older</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const filterGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const selectStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%',
    cursor: 'pointer'
};
