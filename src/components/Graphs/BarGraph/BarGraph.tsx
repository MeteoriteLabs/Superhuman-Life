import { ResponsiveBar } from "@nivo/bar";
import "./BarGraph.css";

function BarGraph({ data, yAxis, title }) {
  return (
    <div className="chart">
      <h6 className="text-center">{title}</h6>
      <ResponsiveBar
        data={data}
        keys={["keys"]}
        indexBy="index"
        margin={{
          top: 50,
          right: 130,
          bottom: 50,
          left: 60,
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
          legend: `${yAxis}`,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="inherit:darker(1.6)"
        animate={true}
      />
    </div>
  );
}

export default BarGraph;
