import { Typography, styled } from "@mui/material";

interface TextTitleProps {
  color?: string;
  fontSize?: string;
  textWrap?: string;
  overflow?: string;
  textOverflow?: string;
  fontWeight?: string;
  margin?: string;
}

const TextTitle = styled(Typography)<TextTitleProps>`
  font-family: "Montserrat";
  color: ${(props) => props.color || "var(--eerie-black-00)"};
  text-wrap: ${(props) => props.textWrap || "normal"};
  overflow: ${(props) => props.overflow || "visible"};
  text-overflow: ${(props) => props.textOverflow || "clip"};
  font-size: ${(props) => props.fontSize || "16px"};
  font-weight: ${(props) => props.fontWeight || "600"};
  font-family: "Montserrat";
  letter-spacing: 0.015em;
  line-height: normal;
  margin: ${(props) => props.margin || "0"};
`;
export default TextTitle;
