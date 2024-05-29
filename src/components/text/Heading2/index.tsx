import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontSizeMobile?: string | number;
  $lineHeightMobile?: string | number;
  fontStyle?: string;
}

const Heading2 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.03em;
  color: ${(props) => `var(${props.colorname || "--eerie-black"})`};
  @media only screen and (max-width: 767px) {
    font-size: ${(props) => props.fontSizeMobile || "22px"};
    line-height: ${(props) => props.$lineHeightMobile || "32px"};
  }
`;

export default Heading2;
