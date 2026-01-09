import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import { geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';

const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json";

interface StateMapProps {
    stateName: string;
    corruptionLevel: number;
}

const colorScale = scaleLinear<string>()
    .domain([0, 100])
    .range(["#ffedea", "#ff5233"]);

export const StateMap: React.FC<StateMapProps> = ({ stateName, corruptionLevel }) => {
    const [projectionConfig, setProjectionConfig] = useState<{ scale: number; center: [number, number] } | null>(null);
    const [geographyData, setGeographyData] = useState<any>(null);

    const dataFetchedRef = React.useRef(false);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        fetch(INDIA_TOPO_JSON)
            .then(response => response.json())
            .then(topology => {
                setGeographyData(topology);
                const geographies = (feature(topology, topology.objects.india as any) as any).features;
                const stateGeo = geographies.find((geo: any) => {
                    const geoName = geo.properties.NAME_1 || geo.properties.name;
                    return geoName === stateName;
                });

                if (stateGeo) {
                    const projection = geoMercator().fitExtent(
                        [[20, 50], [550, 550]], // Increased size more
                        stateGeo
                    );

                    setProjectionConfig({
                        scale: projection.scale(),
                        center: projection.invert!([400, 300]) as [number, number]
                    });
                }
            });
    }, [stateName]);

    if (!projectionConfig || !geographyData) {
        return <div className="state-map-wrapper" style={{ justifyContent: 'center', paddingLeft: 0 }}>Loading map...</div>;
    }

    return (
        <div className="state-map-wrapper">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={projectionConfig}
                width={800}
                height={600}
                className="state-map-svg"
            >
                <Geographies geography={geographyData}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies
                            .filter(geo => {
                                const geoName = geo.properties.NAME_1 || geo.properties.name;
                                return geoName === stateName;
                            })
                            .map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={colorScale(corruptionLevel)}
                                    stroke="#FFFFFF"
                                    strokeWidth={1}
                                    style={{
                                        default: {
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#F53",
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#E42",
                                            outline: "none",
                                        },
                                    }}
                                    data-tooltip-id="state-tooltip"
                                    data-tooltip-content={`${stateName}: ${corruptionLevel}% Corruption`}
                                />
                            ))
                    }
                </Geographies>
            </ComposableMap>
            <Tooltip id="state-tooltip" />
        </div>
    );
};
