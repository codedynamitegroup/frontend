import Box from "@mui/material/Box";
import { BarPlot, ChartsTooltip, axisClasses, useDrawingArea } from "@mui/x-charts";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AxisConfig } from "@mui/x-charts/models";
import { useSearchParams } from "react-router-dom";
import { DrawingThresholdLine } from "./components/DrawingThresholdLine";
import DrawingXAxis from "./components/DrawingXAxis";
import { useTranslation } from "react-i18next";

const SimilarityHistogram = ({
  xAxisData,
  y,
  threshold
}: {
  xAxisData: number[];
  y: number[];
  threshold: number;
}) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";

  const SlotBarElement = (props: any) => {
    const { left, width } = useDrawingArea();
    const xOfThreshold = left + width * (threshold / 100);
    const isGreaterThanThreshold =
      props.style.x.animation.to + props.style.width.animation.to > xOfThreshold;
    const color = isGreaterThanThreshold ? "var(--blue-500)" : "var(--blue-1)";

    // const valueFromPositionOfBar = Math.floor(((props.style.x.animation.to - left) / width) * 100);

    // work around export of BarElement
    return (
      <rect
        fill={color}
        height={props.style.height.animation.to}
        width={props.style.width.animation.to}
        x={props.style.x.animation.to}
        y={props.style.y.animation.to}
        // onClick={() => {
        //   navigate(
        //     routes.lecturer.exam.code_submissions +
        //       `?questionId=${questionId}?startSimilarity=${valueFromPositionOfBar}&endSimilarity=${valueFromPositionOfBar + 5}`
        //   );
        // }}
        // cursor='pointer'
      />
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <ResponsiveChartContainer
        xAxis={[
          {
            label: t("code_plagiarism_similarity_title"),
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
            transform: "translate(-5px, 0)"
          }
        }}
      >
        <BarPlot slots={{ bar: SlotBarElement }} slotProps={{}} />
        <ChartsYAxis />
        <DrawingXAxis />
        <DrawingThresholdLine
          threshold={threshold}
          label={t("code_plagiarism_threshold_title")}
          lineStyle={{ stroke: "black" }}
          labelStyle={{ fontSize: "10" }}
          labelAlign='start'
        />
        <ChartsTooltip />
      </ResponsiveChartContainer>
    </Box>
  );
};

export default SimilarityHistogram;
