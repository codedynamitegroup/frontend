import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  nonoverflow?: boolean;
}

const Heading3 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 22px;
  line-height: 32px;
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  @media only screen and (max-width: 767px) {
    font-size: 18px;
  }
  ${(props) =>
    props.nonoverflow &&
    `
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  `}
`;

export default Heading3;
