import React from "react";
import StyledPath from "../StyledPath";
import { useDrawingArea } from "@mui/x-charts";
import StyledText from "../StyledText";
import { useTranslation } from "react-i18next";

const DrawingXAxis = () => {
  const { t } = useTranslation();
  const xAxisData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const { left, top, width, height } = useDrawingArea();

  return (
    <React.Fragment>
      <StyledPath d={`M ${left} ${top + height} l ${width} 0`} fill='none' />
      {xAxisData.map((value, index) => {
        const x = left + width * (value / 100);
        return (
          <React.Fragment key={index}>
            <StyledPath d={`M ${x} ${top + height} l 0 5`} fill='none' />
            <StyledText
              x={x}
              y={top + height + 10}
              textAnchor='middle'
              dominantBaseline='text-before-edge'
              fontSize={"12px"}
            >
              {value}%
            </StyledText>
          </React.Fragment>
        );
      })}
      {/* Add label of xAxis */}
      <StyledText
        x={left + width / 2}
        y={top + height + 30}
        textAnchor='middle'
        dominantBaseline='text-before-edge'
        fontSize={"14px"}
      >
        {t("code_plagiarism_similarity_title")}
      </StyledText>
    </React.Fragment>
  );
};

export default DrawingXAxis;
