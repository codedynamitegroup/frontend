import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { BarChart, HighlightScope, useDrawingArea } from "@mui/x-charts";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AllSeriesType } from "@mui/x-charts/models";
import React from "react";

const StyledPath = styled("path")(({ theme, fill }) => ({
  fill: fill,
  stroke: theme.palette.text.primary,
  shapeRendering: "crispEdges",
  strokeWidth: 1
}));

const StyledText = styled("text")(({ theme }) => ({
  stroke: "none",
  fill: theme.palette.text.primary,
  shapeRendering: "crispEdges"
}));

function DrawingBarPlot({
  threshold,
  groups
}: {
  threshold: number;
  groups: {
    start: number;
    end: number;
    value: number;
  }[];
}) {
  const { left, top, width, height } = useDrawingArea();

  return (
    <React.Fragment>
      {groups.map((group, index) => {
        const barWidth = width * ((group.end - group.start) / 100) - 2; // Calculate bar width based on range
        const barX = left + width * (group.start / 100) + 1; // Calculate bar x-coordinate
        const barHeight = height * (group.value / 100); // Calculate bar height based on value
        const barY = top + height - barHeight; // Calculate bar y-coordinate

        return (
          <React.Fragment>
            <StyledPath
              key={index}
              d={`M ${barX} ${barY} l ${barWidth} 0 l 0 ${barHeight} l -${barWidth} 0 Z`} // Draw bar rectangle
              fill={threshold < group.end ? "var(--blue-500)" : "var(--blue-1)"}
            />
            <StyledText
              x={barX + barWidth / 2}
              y={barY - 5}
              textAnchor='middle'
              dominantBaseline='text-after-edge'
            >
              {group.value ? `${group.value}%` : `${group.start}% - ${group.end}%`}
            </StyledText>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

const SimilarityHistogram = ({ threshold }: { threshold: number }) => {
  const xAxisData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // const y = [5, 5, 10, 90, 85, 70, 30, 25, 25, 10, 5];
  const y = [
    {
      start: 10,
      end: 15,
      value: 5
    },
    {
      start: 15,
      end: 20,
      value: 5
    },
    {
      start: 20,
      end: 30,
      value: 10
    },
    {
      start: 30,
      end: 40,
      value: 90
    },
    {
      start: 40,
      end: 50,
      value: 85
    },
    {
      start: 50,
      end: 60,
      value: 70
    },
    {
      start: 60,
      end: 70,
      value: 30
    },
    {
      start: 70,
      end: 80,
      value: 25
    },
    {
      start: 80,
      end: 90,
      value: 25
    },
    {
      start: 95,
      end: 100,
      value: 10
    }
  ];

  const highlighted = "item";
  const faded = "global";

  const config = {
    series: [
      {
        type: "line",
        data: y.map((item) => item.value),
        highlightScope: {
          highlighted,
          faded
        } as HighlightScope
      }
    ] as AllSeriesType[],
    height: 400,
    xAxis: [
      {
        data: xAxisData,
        scaleType: "linear",
        valueFormatter: (value: number) => `${value}%`
      } as const
    ]
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <ResponsiveChartContainer {...config}>
        <DrawingBarPlot threshold={threshold} groups={y} />
        <ChartsReferenceLine
          x={threshold}
          lineStyle={{ stroke: "black" }}
          labelStyle={{ fontSize: "10" }}
          label={`độ tương đồng cao nhất`}
          labelAlign='start'
        />

        {/* <ChartsReferenceLine y={50} label='Middle value' labelAlign='end' /> */}
        <ChartsXAxis label='Độ tương đồng' />
        <ChartsYAxis label='Số lượng tệp nộp' />
      </ResponsiveChartContainer>
    </Box>
  );
};

export default SimilarityHistogram;
