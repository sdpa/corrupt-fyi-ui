import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                zIndex: 10,
                padding: '1rem 0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        Corruption Tracker
                    </div>
                    <nav>
                        <a href="/" style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Overview</a>
                        <a href="/explore" style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Explore Data</a>
                        <a href="/submit" style={{ marginLeft: '1.5rem', color: 'var(--accent-primary)', fontWeight: 500, textDecoration: 'none' }}>Add a Report</a>
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to delete ALL reports? This cannot be undone.')) {
                                    try {
                                        const { api } = await import('../services/api');
                                        await api.deleteAllReports();
                                        window.location.reload();
                                    } catch (err) {
                                        console.error('Failed to delete reports:', err);
                                        alert('Failed to delete reports');
                                    }
                                }
                            }}
                            style={{
                                marginLeft: '1.5rem',
                                color: '#DC2626',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                                fontFamily: 'inherit',
                                padding: 0
                            }}
                        >
                            Delete All
                        </button>
                    </nav>
                </div>
            </header>

            <main style={{
                flex: 1,
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                {children}
            </main>

            <footer style={{
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
                padding: '2rem 0',
                marginTop: 'auto'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.875rem'
                }}>
                    <p>© {new Date().getFullYear()} Corruption Tracker. User-reported, anonymous submissions. Not independently verified.</p>
                </div>
            </footer>
        </div>
    );
};
