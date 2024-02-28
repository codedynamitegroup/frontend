import { useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "@mui/material";

interface CustomHeatMapProps {
  value: {
    date: string;
    count: number;
  }[];
}

const CustomHeatMap = ({ value }: CustomHeatMapProps) => {
  const [selected, setSelected] = useState("");
  return (
    <>
      <HeatMap
        width={"100%"}
        value={value}
        startDate={new Date("2016/01/01")}
        rectSize={14}
        rectRender={(props, data) => {
          if (selected !== "") {
            props.opacity = data.date === selected ? 1 : 0.45;
          }
          return (
            <Tooltip title={`${data.count || 0} bài nộp vào ${data.date}`} placement='top'>
              <rect
                {...props}
                onClick={() => {
                  setSelected(data.date === selected ? "" : data.date);
                }}
              />
            </Tooltip>
          );
        }}
      />
    </>
  );
};
export default CustomHeatMap;
