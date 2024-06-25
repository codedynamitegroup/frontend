import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontStyle?: string;
}

const ParagraphSmall = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 400};
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  font-size: 12px;
  line-height: 18px;
`;

export default ParagraphSmall;
