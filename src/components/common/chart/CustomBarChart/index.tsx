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
  customStyle?: boolean | undefined;
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
  customStyle,
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
      sx={
        customStyle
          ? {
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
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translate(-10px, 0)"
              }
            }
          : {
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translate(-25px, 0)"
              },
              padding: padding || "25px"
            }
      }
    />
  );
}
