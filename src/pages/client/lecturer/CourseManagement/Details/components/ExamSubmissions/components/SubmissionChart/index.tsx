import CustomBarChart from "components/common/chart/CustomBarChart";

interface SubmissionBarChartProps {
  dataset: any;
  xAxis: any;
  width: number;
  height: number;
}

export default function SubmissionBarChart({
  dataset,
  xAxis,
  width,
  height,
  ...props
}: SubmissionBarChartProps) {
  const valueFormatter = (value: number | null) =>
    value === null ? "No data" : `${value} sinh viên`;

  const series = [{ dataKey: "student", label: "Sinh viên", valueFormatter }];

  const yAxis = [{ label: "Tổng số sinh viên đạt khoảng điểm" }];

  return (
    <CustomBarChart
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
