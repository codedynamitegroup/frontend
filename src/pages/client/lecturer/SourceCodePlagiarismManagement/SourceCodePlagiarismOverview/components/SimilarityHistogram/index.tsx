import Box from "@mui/material/Box";
import { BarPlot, ChartsTooltip, axisClasses, useDrawingArea } from "@mui/x-charts";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { AxisConfig } from "@mui/x-charts/models";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DrawingThresholdLine } from "./components/DrawingThresholdLine";
import DrawingXAxis from "./components/DrawingXAxis";
import { routes } from "routes/routes";

const SimilarityHistogram = ({ threshold }: { threshold: number }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";
  const xAxisData = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

  const y = [0, 5, 10, 10, 15, 20, 50, 30, 35, 70, 45, 50, 55, 60, 65, 70, 75, 5, 0, 95];

  const SlotBarElement = (props: any) => {
    const { left, width } = useDrawingArea();
    const xOfThreshold = left + width * (threshold / 100);
    const isGreaterThanThreshold =
      props.style.x.animation.to + props.style.width.animation.to > xOfThreshold;
    const color = isGreaterThanThreshold ? "var(--blue-500)" : "var(--blue-1)";

    const valueFromPositionOfBar = Math.floor(((props.style.x.animation.to - left) / width) * 100);

    // work around export of BarElement
    return (
      <rect
        fill={color}
        height={props.style.height.animation.to}
        width={props.style.width.animation.to}
        x={props.style.x.animation.to}
        y={props.style.y.animation.to}
        onClick={() => {
          navigate(
            routes.lecturer.exam.code_submissions +
              `?questionId=${questionId}?startSimilarity=${valueFromPositionOfBar}&endSimilarity=${valueFromPositionOfBar + 5}`
          );
        }}
        cursor='pointer'
      />
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <ResponsiveChartContainer
        xAxis={[
          {
            label: "Độ tương đồng",
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
              return `${value} bài nộp`;
            }
          }
        ]}
        yAxis={[
          {
            label: "Số lượng bài nộp",
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
          label={"Ngưỡng độ tương đồng cao nhất"}
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
