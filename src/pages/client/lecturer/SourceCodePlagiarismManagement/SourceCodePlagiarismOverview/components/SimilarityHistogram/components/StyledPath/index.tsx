import { styled } from "@mui/material";

const StyledPath = styled("path")(({ theme, fill }) => ({
  fill: fill,
  stroke: theme.palette.text.primary,
  shapeRendering: "crispEdges",
  strokeWidth: 1
}));

export default StyledPath;
