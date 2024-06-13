import { Typography, styled } from "@mui/material";

interface Props {
  colorname?: string;
  fontStyle?: string;
  fontWeight?: number | string;
  fontSize?: string;
  wordWrap?: string;
  nonoverflow?: boolean;
}

const ParagraphBody = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || 400};
  color: ${(props) => `var(${props.colorname || "--eerie-black-00"})`};
  font-size: ${(props) => props.fontSize || "16px"};
  line-height: "24px";
  word-wrap: ${(props) => props.wordWrap || undefined};

  ${(props) =>
    props.nonoverflow &&
    `
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  `}
`;

export default ParagraphBody;
