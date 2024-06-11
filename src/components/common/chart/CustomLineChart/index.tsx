import { LineChart, areaElementClasses, useDrawingArea, useYScale } from "@mui/x-charts";
import { ScaleLinear } from "d3";

interface PropsData {
  scaleType: "time" | "point" | "linear" | "band" | "log" | "pow" | "sqrt" | "utc" | undefined;
  data: string[];
  series: { data: number[]; label: string; area: boolean }[];
  startGradientColor: string;
  endGradientColor: string;
}

const CustomLineChart = (props: PropsData) => {
  const { scaleType, data, startGradientColor, endGradientColor, series } = props;
  const maxSeries = series.reduce((acc, curr) => {
    const max = Math.max(...curr.data);
    return max > acc ? max : acc;
  }, -99999999);

  return (
    <LineChart
      sx={{
        "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
          stroke: "var(--gray-40)",
          strokeWidth: 0.4
        },
        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
          stroke: "white",
          strokeWidth: 0.4
        },
        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
          strokeWidth: "0.4",
          fill: "var(--gray-40)",
          fontSize: 12,
          fontFamily: "Roboto"
        },
        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
          strokeWidth: "0.4",
          fill: "var(--gray-40)",
          fontSize: 12,
          fontFamily: "Roboto"
        },
        "& .MuiChartsAxis-bottom .MuiChartsAxis-tick": {
          strokeWidth: "1",
          stroke: "var(--gray-40)",
          fontSize: 12,
          fontFamily: "Roboto"
        },
        [`& .${areaElementClasses.root}`]: {
          fill: "url(#swich-color-id-1)"
        }
      }}
      colors={[startGradientColor, endGradientColor]}
      xAxis={[
        {
          scaleType: scaleType,
          data: data.length !== 0 ? data : []
        }
      ]}
      yAxis={[
        {
          scaleType: "linear",
          disableTicks: true // hide ticks
        }
      ]}
      series={series.length === 0 ? [] : series}
      height={320}
      grid={{
        horizontal: true
      }}
      // borderRadius={10}
      margin={{
        left: 30,
        right: 20,
        top: 40,
        bottom: 30
      }}
      slotProps={{
        legend: {
          hidden: true
        }
      }}
    >
      <Colorswitch
        startGradientColor={startGradientColor}
        endGradientColor={endGradientColor}
        threshold={0}
        id='swich-color-id-1'
      />
    </LineChart>
  );
};

export default CustomLineChart;

type ColorSwichProps = {
  threshold: number;
  startGradientColor: string;
  endGradientColor: string;
  id: string;
};

const Colorswitch = ({ threshold, id, endGradientColor, startGradientColor }: ColorSwichProps) => {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale() as ScaleLinear<number, number>; // You can provide the axis Id if you have multiple ones
  const y0 = scale(threshold); // The coordinate of of the origine
  const off = y0 !== undefined ? y0 / svgHeight : 0;

  return (
    <>
      <defs>
        <linearGradient
          id={id}
          x1='0'
          x2='0'
          y1='0'
          y2={`${svgHeight}px`}
          gradientUnits='userSpaceOnUse' // Use the SVG coordinate instead of the component ones.
        >
          <stop offset={off} stopColor={startGradientColor} stopOpacity={0.4} />
          <stop offset={off} stopColor={endGradientColor} stopOpacity={0} />
        </linearGradient>
      </defs>
    </>
  );
};
