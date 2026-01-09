import React from 'react';
import { SubmissionForm } from '../components/SubmissionForm';

export const Submit: React.FC = () => {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Submit a Report</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Help us uncover patterns of corruption. Your identity is protected.</p>
            </div>
            <SubmissionForm />
        </div>
    );
};
