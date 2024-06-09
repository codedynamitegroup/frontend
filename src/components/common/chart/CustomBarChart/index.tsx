import * as React from "react";
import { BarChart, BarChartProps } from "@mui/x-charts/BarChart";
import {
  AxisConfig,
  ChartsXAxisProps,
  ChartsYAxisProps,
  ScaleName,
  axisClasses
} from "@mui/x-charts";
import { DatasetType } from "@mui/x-charts/models/seriesType/config";
import { MakeOptional } from "@mui/x-date-pickers/internals";

interface SubmissionChartProps extends Omit<BarChartProps, "xAxis" | "yAxis"> {
  dataset?: DatasetType | undefined;
  xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, "id">[] | undefined;
  yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, "id">[] | undefined; // Changed ChartsXAxisProps to ChartsYAxisProps
  width?: number | undefined;
  height?: number | undefined;
  borderRadius?: number | undefined;
  gridVertical?: boolean | undefined;
  gridHorizontal?: boolean | undefined;
  padding?: string | undefined;
}

export default function CustomBarChart({
  dataset,
  xAxis,
  yAxis,
  series,
  width,
  height,
  gridHorizontal,
  gridVertical,
  borderRadius,
  padding,
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
      grid={{
        vertical: gridVertical,
        horizontal: gridHorizontal
      }}
      borderRadius={borderRadius}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translate(-25px, 0)"
        },
        padding: padding || "25px"
      }}
    />
  );
}
