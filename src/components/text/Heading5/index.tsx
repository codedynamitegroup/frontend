import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontStyle?: string;
}

const Heading5 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

export default Heading5;
