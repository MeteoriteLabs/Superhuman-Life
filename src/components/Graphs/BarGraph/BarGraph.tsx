import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const Wrapper = (props) => (
    <div
        {...props}
        style={{
            height: '500px',
            width: '100%',
            minWidth: '900px'
        }}
    />
);

const BarGraph: React.FC<{
    data: { index: string; Clients?: number; Leads?: number }[];
    yAxis: string;
    keyName: string[];
}> = (props) => {
    return (
        <>
            <Wrapper>
                <ResponsiveBar
                    data={props.data}
                    keys={props.keyName}
                    indexBy="index"
                    margin={{
                        top: 50,
                        right: 130,
                        bottom: 50,
                        left: 60
                    }}
                    padding={0.3}
                    colors="nivo"
                    colorBy="id"
                    borderColor="inherit:darker(1.6)"
                    axisTop={null}
                    axisRight={null}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: `${props.yAxis}`,
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor="inherit:darker(1.6)"
                    animate={true}
                />
            </Wrapper>
        </>
    );
};

export default BarGraph;
