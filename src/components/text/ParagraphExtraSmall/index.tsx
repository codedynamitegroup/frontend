import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: string | number;
}

const ParagraphExtraSmall = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 400};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.015em;
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
`;

export default ParagraphExtraSmall;
