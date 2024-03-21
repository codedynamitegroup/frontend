import Box from "@mui/material/Box";
import { BarElement, BarPlot, ChartsTooltip, axisClasses, useDrawingArea } from "@mui/x-charts";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AxisConfig } from "@mui/x-charts/models";
import { DrawingThresholdLine } from "./components/DrawingThresholdLine";
import DrawingXAxis from "./components/DrawingXAxis";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";

export enum SimilarityHistogramField {
  SIMILARITY = "similarity",
  LONGEST_FRAGMENT = "longestFragment",
  TOTAL_OVERLAP = "totalOverlap"
}

const SimilarityHistogram = ({
  xAxisData,
  y,
  threshold,
  currentValue,
  field = SimilarityHistogramField.SIMILARITY
}: {
  xAxisData: number[];
  y: number[];
  threshold?: number;
  currentValue?: number;
  field?: SimilarityHistogramField;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const SlotBarElement = (props: any) => {
    const { left, width } = useDrawingArea();
    const startSimilarity = xAxisData[props.ownerState.dataIndex] / 100;
    const endSimilarity = (xAxisData[props.ownerState.dataIndex] + 5) / 100;

    if (field === SimilarityHistogramField.SIMILARITY && threshold !== undefined) {
      const xOfThreshold = left + width * (threshold / 100);
      const isGreaterThanThreshold =
        props.style.x.animation.to + props.style.width.animation.to > xOfThreshold;
      const color = isGreaterThanThreshold ? "var(--blue-500)" : "var(--blue-1)";

      return (
        <BarElement
          {...props}
          fill={color}
          cursor={"pointer"}
          onClick={() => {
            navigate(
              routes.lecturer.exam.code_plagiarism_detection_submissions +
                `?startSimilarity=${startSimilarity}&endSimilarity=${endSimilarity}`
            );
          }}
        />
      );
    } else if (
      field === SimilarityHistogramField.SIMILARITY &&
      threshold === undefined &&
      currentValue !== undefined
    ) {
      // Get the bar element contain current value and fill it with red color
      const xOfCurrentValue = left + width * (currentValue / 100);
      let isCurrentValue =
        props.style.x.animation.to + props.style.width.animation.to > xOfCurrentValue &&
        props.style.x.animation.to < xOfCurrentValue;
      let color = isCurrentValue ? "red" : "var(--blue-500)";

      if (currentValue === 100) {
        isCurrentValue =
          props.style.x.animation.to + props.style.width.animation.to + 1 > xOfCurrentValue &&
          props.style.x.animation.to < xOfCurrentValue;
        color = isCurrentValue ? "red" : "var(--blue-500)";

        // If current value is 100%, fill the last bar with red color
        return (
          <BarElement
            {...props}
            fill={color}
            onClick={() => {
              navigate(
                routes.lecturer.exam.code_plagiarism_detection_submissions +
                  `?startSimilarity=${startSimilarity}&endSimilarity=${endSimilarity}`
              );
            }}
          />
        );
      }

      return (
        <BarElement
          {...props}
          fill={color}
          onClick={() => {
            navigate(
              routes.lecturer.exam.code_plagiarism_detection_submissions +
                `?startSimilarity=${startSimilarity}&endSimilarity=${endSimilarity}`
            );
          }}
        />
      );
    } else {
      return (
        <BarElement
          {...props}
          fill={"var(--blue-500)"}
          onClick={() => {
            navigate(
              routes.lecturer.exam.code_plagiarism_detection_submissions +
                `?startSimilarity=${startSimilarity}&endSimilarity=${endSimilarity}`
            );
          }}
        />
      );
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <ResponsiveChartContainer
        xAxis={[
          {
            scaleType: "band",
            data: xAxisData,
            barGapRatio: 0,
            categoryGapRatio: 0.1,
            valueFormatter: (value: number) => `${value}%-${value + 5}%`
          } as AxisConfig<"band">
        ]}
        series={[
          {
            type: "bar",
            data: y,
            valueFormatter(value) {
              return t("code_plagiarism_report_analyzed_submissions_count", { count: value });
            }
          }
        ]}
        yAxis={[
          {
            label: t("code_plagiarism_submissions_count_title"),
            scaleType: "linear"
          }
        ]}
        height={400}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translate(-10px, 0)"
          }
        }}
      >
        <BarPlot
          slots={{
            bar: (props) => {
              return <SlotBarElement {...props} />;
            }
          }}
        />
        <ChartsYAxis />
        <DrawingXAxis
          label={
            field === SimilarityHistogramField.SIMILARITY
              ? t("code_plagiarism_similarity_title")
              : field === SimilarityHistogramField.LONGEST_FRAGMENT
                ? "Đoạn tương đồng dài nhất"
                : "Trùng lặp tổng cộng"
          }
        />
        {field === SimilarityHistogramField.SIMILARITY && threshold !== undefined && (
          <DrawingThresholdLine
            threshold={threshold || 0}
            label={t("code_plagiarism_threshold_title")}
            lineStyle={{ stroke: "black" }}
            labelStyle={{ fontSize: "10" }}
            labelAlign='start'
          />
        )}
        {field === SimilarityHistogramField.SIMILARITY &&
          threshold === undefined &&
          currentValue !== undefined && (
            <DrawingThresholdLine
              threshold={currentValue || 0}
              label=''
              lineStyle={{ stroke: "black" }}
              labelStyle={{ fontSize: "10" }}
              labelAlign='start'
            />
          )}
        <ChartsTooltip />
      </ResponsiveChartContainer>
    </Box>
  );
};

export default SimilarityHistogram;
