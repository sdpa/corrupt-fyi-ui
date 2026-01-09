import React, { useEffect, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    type ColDef,
    ModuleRegistry,
    ClientSideRowModelModule,
    PaginationModule,
    NumberFilterModule,
    DateFilterModule,
    TextFilterModule,
    ValidationModule,
    RowAutoHeightModule
} from 'ag-grid-community';
import { api } from '../services/api';
import type { Report } from '../types/api';

// Register modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    PaginationModule,
    NumberFilterModule,
    DateFilterModule,
    TextFilterModule,
    ValidationModule,
    RowAutoHeightModule
]);

// Styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

export const Explore: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = React.useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchReports = async () => {
            try {
                const data = await api.getAllReports();
                setReports(data);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setError('Failed to load reports');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Custom Cell Renderers
    const AmountRenderer = (params: any) => {
        if (!params.value) return null;
        const amount = typeof params.value === 'number' ? params.value : parseInt(String(params.value).replace(/[^0-9]/g, ''), 10);

        const format = (val: number) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);

        return format(amount);
    };

    const DateRenderer = (params: any) => {
        if (!params.value) return null;
        return new Date(params.value).toLocaleDateString();
    };

    const colDefs: ColDef[] = useMemo(() => [
        {
            field: 'department',
            headerName: 'Department',
            flex: 1.5,
            filter: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 3,
            filter: true,
            autoHeight: true,
            wrapText: true
        },
        {
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            cellRenderer: AmountRenderer,
            filter: 'agNumberColumnFilter',
        },
        {
            field: 'state',
            headerName: 'State',
            flex: 1,
            filter: true,
        },
        {
            field: 'district',
            headerName: 'district',
            flex: 1,
            filter: true,
        },
        {
            field: 'city',
            headerName: 'City',
            flex: 1,
            filter: true,
        },
        {
            field: 'date_reported',
            headerName: 'Date',
            flex: 1,
            cellRenderer: DateRenderer,
            filter: 'agDateColumnFilter',
            sort: 'desc',
        }
    ], []);

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
        filter: true,
    }), []);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Explore Data</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Browse all anonymous reports submitted by citizens.</p>
            </div>

            {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading reports...
                </div>
            ) : error ? (
                <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: '0.5rem', color: '#DC2626' }}>
                    {error}
                </div>
            ) : (
                <div className="ag-theme-quartz" style={{ height: 'calc(100vh - 250px)', width: '100%' }}>
                    <AgGridReact
                        theme="legacy"
                        rowData={reports}
                        columnDefs={colDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[20, 50, 100]}
                        rowHeight={60}
                    />
                </div>
            )}
        </div>
    );
};
