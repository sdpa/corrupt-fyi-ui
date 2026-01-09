import React, { useState } from 'react';
import { api } from '../services/api';
import type { NewReportInput } from '../types/api';
import { INDIAN_STATES } from '../data/constants';

export const SubmissionForm: React.FC = () => {
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        district: '',
        department: '',
        service: '',
        amount: '',
        date: '',
        requestedDirectly: 'no'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [districts, setDistricts] = useState<string[]>([]);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

    React.useEffect(() => {
        const fetchDistricts = async () => {
            if (!formData.state) {
                setDistricts([]);
                return;
            }

            setIsLoadingDistricts(true);
            try {
                const fetchedDistricts = await api.getDistricts(formData.state);
                setDistricts(fetchedDistricts);
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            } finally {
                setIsLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, [formData.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Remove non-digits
        const rawValue = value.replace(/[^0-9]/g, '');

        if (rawValue) {
            // Format using Indian numbering system
            const formatted = new Intl.NumberFormat('en-IN').format(parseInt(rawValue, 10));
            setFormData(prev => ({ ...prev, amount: formatted }));
        } else {
            setFormData(prev => ({ ...prev, amount: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const reportData: NewReportInput = {
                department: formData.department,
                amount: parseFloat(formData.amount.replace(/,/g, '')),
                state: formData.state.toUpperCase(),
                district: formData.district || undefined,
                city: formData.city || undefined,
                description: formData.service,
            };

            await api.createReport(reportData);
            setSubmitStatus('success');

            // Reset form after successful submission
            setFormData({
                city: '',
                state: '',
                district: '',
                department: '',
                service: '',
                amount: '',
                date: '',
                requestedDirectly: 'no'
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000);
        } catch (error: any) {
            setSubmitStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to submit report. Please try again.');
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--highlight-neutral)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                <strong>Privacy Notice:</strong> This submission is anonymous and cannot be traced back to you. We do not collect IP addresses or personal identifiers.
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Submit a Report</h2>

            <div style={formGroupStyle}>
                <label style={labelStyle}>State</label>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                        <option key={state.code} value={state.code}>
                            {state.name} ({state.code})
                        </option>
                    ))}
                </select>
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle}>District</label>
                <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={!formData.state || isLoadingDistricts}
                >
                    <option value="">{isLoadingDistricts ? 'Loading...' : 'Select District'}</option>
                    {districts.map(district => (
                        <option key={district} value={district}>
                            {district}
                        </option>
                    ))}
                </select>
            </div>


            <div style={formGroupStyle}>
                <label style={labelStyle}>City / Mandal</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="e.g. Mumbai"
                    required
                />
            </div>




            <div style={formGroupStyle}>
                <label style={labelStyle}>Department / Office</label>
                <select name="department" value={formData.department} onChange={handleChange} style={inputStyle} required>
                    <option value="">Select Department</option>
                    <option value="Police">Police</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Transport">Transport</option>
                    <option value="Municipal">Municipal Corporation</option>
                    <option value="Electricity">Electricity Board</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle}>Description of Incident</label>
                <textarea
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    required
                    placeholder="Describe what happened..."
                />
            </div>

            <div style={formGroupStyle}>
                <label style={labelStyle}>Amount Paid (INR)</label>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)',
                        pointerEvents: 'none'
                    }}>₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        name="amount"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        style={{ ...inputStyle, paddingLeft: '2rem' }}
                        required
                        placeholder="0"
                    />
                </div>
            </div>

            {submitStatus === 'success' && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#10B981',
                    color: 'white',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    ✓ Report submitted successfully! Thank you for helping fight corruption.
                </div>
            )}

            {submitStatus === 'error' && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    ✗ {errorMessage}
                </div>
            )}

            <button type="submit" disabled={isSubmitting} style={{
                marginTop: '1.5rem',
                backgroundColor: isSubmitting ? '#9CA3AF' : 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 500,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                width: '100%',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
            }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
        </form>
    );
};

const formGroupStyle: React.CSSProperties = {
    marginBottom: '1.25rem'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none'
};


