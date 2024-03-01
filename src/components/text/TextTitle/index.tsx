import { Typography, styled } from "@mui/material";

interface TextTitleProps {
  color?: string;
  fontSize?: string;
  textWrap?: string;
  overflow?: string;
  textOverflow?: string;
}

const TextTitle = styled(Typography)<TextTitleProps>`
  color: ${(props) => props.color || "var(--eerie-black-00)"};
  text-wrap: ${(props) => props.textWrap || "normal"};
  overflow: ${(props) => props.overflow || "visible"};
  text-overflow: ${(props) => props.textOverflow || "clip"};
  font-size: ${(props) => props.fontSize || "16px"};
  font-weight: 600;
  font-family: "Inter";
  letter-spacing: 0.015em;
  line-height: normal;
  margin: 0;
`;
export default TextTitle;
