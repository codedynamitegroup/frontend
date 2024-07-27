import CustomBarChart from "components/common/chart/CustomBarChart";
import { useTranslation } from "react-i18next";

interface SubmissionBarChartProps {
  dataset: any;
  xAxis: any;
  width?: number;
  height: number;
  customStyle?: boolean;
}

export default function SubmissionBarChart({
  dataset,
  xAxis,
  width,
  height,
  customStyle = false,
  ...props
}: SubmissionBarChartProps) {
  const { t } = useTranslation();
  const valueFormatter = (value: number | null) =>
    value === null ? "No data" : `${value} ${t("common_student").toLowerCase()}`;

  const series = [{ dataKey: "student", label: t("common_student"), valueFormatter }];

  const yAxis = [
    {
      label: t("exam_submisison_total_student_score"),
      disableTicks: true // hide ticks
    }
  ];

  return (
    <CustomBarChart
      gridHorizontal
      customStyle={customStyle}
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      width={width}
      height={height}
      {...props}
    />
  );
}
