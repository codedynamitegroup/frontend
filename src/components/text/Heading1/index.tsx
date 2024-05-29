import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontSize?: string;
  fontStyle?: string;
}

const Heading1 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: ${(props) => props.fontSize || "32px"};
  line-height: 48px;
  color: ${(props) => `var(${props.colorname || "--eerie-black"})`};
  @media only screen and (max-width: 767px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

export default Heading1;
