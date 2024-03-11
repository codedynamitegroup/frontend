import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
}

const ParagraphSmall = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 400};
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  font-size: 14px;
  line-height: 24px;
`;

export default ParagraphSmall;
