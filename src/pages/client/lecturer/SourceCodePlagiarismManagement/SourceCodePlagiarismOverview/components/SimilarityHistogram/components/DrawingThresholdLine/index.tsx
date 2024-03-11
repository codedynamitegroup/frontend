import { useDrawingArea } from "@mui/x-charts";
import React from "react";
import StyledPath from "../StyledPath";
import StyledText from "../StyledText";

export const DrawingThresholdLine = ({
  threshold,
  label,
  lineStyle,
  labelStyle,
  labelAlign
}: {
  threshold: number;
  label: string;
  lineStyle: React.SVGProps<SVGLineElement>;
  labelStyle: React.SVGProps<SVGTextElement>;
  labelAlign: "start" | "middle" | "end";
}) => {
  const { left, top, width, height } = useDrawingArea();
  const x = left + width * (threshold / 100);
  return (
    <React.Fragment>
      <StyledPath d={`M ${x} ${top} l 0 ${height}`} fill='none' {...lineStyle} />
      <StyledText
        x={x}
        y={top - 5}
        textAnchor={labelAlign}
        dominantBaseline='text-after-edge'
        fontSize={"14px"}
        {...labelStyle}
      >
        {label}
      </StyledText>
    </React.Fragment>
  );
};
