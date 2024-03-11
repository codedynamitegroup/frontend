import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontSize?: string;
}

const ParagraphBody = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 400};
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  font-size: ${(props) => props.fontSize || "16px"};
  line-height: "24px";
`;

export default ParagraphBody;
