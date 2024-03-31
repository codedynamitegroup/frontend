import { CircularProgressProps, LinearProgress } from "@mui/joy";
import { Box } from "@mui/material";
import ParagraphBody from "components/text/ParagraphBody";

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
  const bgColor = props.value! > 75 ? "danger" : props.value! > 70 ? "warning" : "success";
  const textColor =
    props.value! > 75 ? "--white" : props.value! > 70 ? "--white" : "--eerie-black-00";

  return (
    <Box
      sx={{
        backgroundColor: "var(--white)",
        borderRadius: "20px"
      }}
    >
      <LinearProgress
        determinate
        variant='outlined'
        color={bgColor}
        size='sm'
        thickness={24}
        value={Number(props.value!)}
        sx={{
          "--LinearProgress-radius": "20px",
          "--LinearProgress-thickness": "24px"
        }}
      >
        <ParagraphBody
          colorname={textColor}
          zIndex={1}
        >{`${Math.round(Number(props.value!))}%`}</ParagraphBody>
      </LinearProgress>
    </Box>
  );
};

export default CircularProgressWithLabel;
