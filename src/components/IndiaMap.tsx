import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { HeatmapEntry } from '../types/api';
import { INDIAN_STATES } from '../data/constants';

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json";

const PROJECTION_CONFIG = {
    scale: 1000,
    center: [78.9629, 22.5937] as [number, number]
};

export const IndiaMap: React.FC = () => {
    const navigate = useNavigate();
    const [corruptionData, setCorruptionData] = useState<{ [key: string]: number }>({});
    const [geoData, setGeoData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [maxAmount, setMaxAmount] = useState(0);
    const fetchedRef = React.useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchData = async () => {
            try {
                const [heatmapData, topoJson] = await Promise.all([
                    api.getHeatmapData(),
                    fetch(INDIA_TOPO_JSON).then(res => res.json())
                ]);

                const dataMap: { [key: string]: number } = {};
                let max = 0;
                heatmapData.forEach((entry: HeatmapEntry) => {
                    // Map state codes to full names using the constant
                    const stateObj = INDIAN_STATES.find(s => s.code === entry.state_name);
                    const fullName = stateObj ? stateObj.name : entry.state_name;

                    dataMap[fullName] = entry.total_amount;
                    if (entry.total_amount > max) max = entry.total_amount;
                });
                setMaxAmount(max);
                setCorruptionData(dataMap);
                setGeoData(topoJson);
            } catch (error) {
                console.error('Error fetching map data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getColor = (amount: number) => {
        return scaleLinear<string>()
            .domain([0, maxAmount || 100000]) // Default fallback if max is 0
            .range(["#ffedea", "#ff5233"])(amount);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Corruption Heatmap</h2>
            <div className="w-full max-w-4xl border border-gray-200 rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden relative">
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Loading map data...
                    </div>
                ) : (
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={PROJECTION_CONFIG}
                        width={800}
                        height={600}
                        className="w-full h-auto"
                    >
                        <Geographies geography={geoData}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo) => {
                                    const stateName = geo.properties.NAME_1 || geo.properties.name;
                                    const amount = corruptionData[stateName] || 0;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={getColor(amount)}
                                            stroke="#FFFFFF"
                                            strokeWidth={0.5}
                                            onClick={() => {
                                                if (amount > 0) {
                                                    const stateObj = INDIAN_STATES.find(s => s.name === stateName);
                                                    if (stateObj) {
                                                        navigate(`/state/${stateObj.code}`);
                                                    }
                                                }
                                            }}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: amount > 0 ? "#F53" : getColor(amount),
                                                    outline: "none",
                                                    cursor: amount > 0 ? "pointer" : "default"
                                                },
                                                pressed: {
                                                    fill: amount > 0 ? "#E42" : getColor(amount),
                                                    outline: "none",
                                                },
                                            }}
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={`${stateName}: ${formatCurrency(amount)}`}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                )}
                <Tooltip id="my-tooltip" />

                {/* Legend */}
                {!isLoading && (
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm w-1/3 min-w-[200px]">
                        <div className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Total Bribe Amount</div>
                        <svg width="50%" height="32" className="w-full">
                            <defs>
                                <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ffedea" />
                                    <stop offset="100%" stopColor="#ff5233" />
                                </linearGradient>
                            </defs>

                            {/* Bar */}
                            <rect x="0" y="0" width="100%" height="8" fill="url(#legendGradient)" rx="4" />

                            {/* Grid Lines / Ticks */}
                            <line x1="0%" y1="0" x2="0%" y2="12" stroke="#9CA3AF" strokeWidth="1" />
                            <line x1="25%" y1="0" x2="25%" y2="8" stroke="#9CA3AF" strokeWidth="1" />
                            <line x1="50%" y1="0" x2="50%" y2="12" stroke="#9CA3AF" strokeWidth="1" />
                            <line x1="75%" y1="0" x2="75%" y2="8" stroke="#9CA3AF" strokeWidth="1" />
                            <line x1="100%" y1="0" x2="100%" y2="12" stroke="#9CA3AF" strokeWidth="1" />

                            {/* Labels */}
                            <text x="0" y="24" fontSize="10" fill="currentColor" className="text-gray-500 dark:text-gray-400" textAnchor="start">₹0</text>
                            <text x="100%" y="24" fontSize="10" fill="currentColor" className="text-gray-500 dark:text-gray-400" textAnchor="end">{formatCurrency(maxAmount)}</text>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};
