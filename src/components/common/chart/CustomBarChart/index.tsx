import * as React from "react";
import { BarChart, BarChartProps } from "@mui/x-charts/BarChart";
import { AxisConfig, axisClasses } from "@mui/x-charts";
import { DatasetType } from "@mui/x-charts/models/seriesType/config";
import { MakeOptional } from "@mui/x-date-pickers/internals";

interface SubmissionChartProps extends BarChartProps {
  dataset?: DatasetType | undefined;
  xAxis?: MakeOptional<AxisConfig, "id">[] | undefined;
  yAxis?: MakeOptional<AxisConfig, "id">[] | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export default function CustomBarChart({
  dataset,
  xAxis,
  yAxis,
  series,
  width,
  height,
  ...props
}: SubmissionChartProps) {
  return (
    <BarChart
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      width={width}
      height={height}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translate(-25px, 0)"
        },
        padding: "25px"
      }}
      {...props}
    />
  );
}
