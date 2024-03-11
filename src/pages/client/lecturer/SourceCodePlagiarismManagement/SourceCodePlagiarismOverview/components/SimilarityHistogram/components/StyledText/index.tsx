import { styled } from "@mui/material";

const StyledText = styled("text")(({ theme }) => ({
  stroke: "none",
  fill: theme.palette.text.primary,
  shapeRendering: "crispEdges"
}));

export default StyledText;
