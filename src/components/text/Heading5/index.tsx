import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  textWrap?: string;
  nonoverflow?: boolean;
}

const Heading5 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 16px;
  line-height: 24px;
  text-wrap: ${(props) => props.textWrap || "wrap"};
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  @media only screen and (max-width: 767px) {
    font-size: 14px;
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

export default Heading5;
