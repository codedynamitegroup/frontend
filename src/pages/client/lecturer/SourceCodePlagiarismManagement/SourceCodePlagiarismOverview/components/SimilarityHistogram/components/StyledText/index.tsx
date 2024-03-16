import { styled } from "@mui/material";

const StyledText = styled("text")(({ theme }) => ({
  stroke: "none",
  fill: theme.palette.text.primary,
  shapeRendering: "crispEdges",
  fontSize: "14px"
}));

export default StyledText;
