import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";

interface PropsData {
  label: string;
  color: string;
}

const ChartLengend = ({ label, color }: PropsData) => {
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <Box
        sx={{
          height: "10px",
          width: "10px",
          marginRight: "5px",
          backgroundColor: color,
          borderRadius: "100px"
        }}
      />
      <ParagraphBody fontSize={"0.75rem"} colorname='--gray-40'>
        {label}
      </ParagraphBody>
    </Box>
  );
};

export default ChartLengend;
