import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";

interface PropsData {
  tooltipDescription: string;
  fontSize?: string;
  margin?: string;
}

const InfoTooltip = (props: PropsData) => {
  const { tooltipDescription, fontSize, margin } = props;

  return (
    <>
      <Tooltip title={tooltipDescription} placement='top' arrow>
        <InfoIcon sx={{ fontSize: fontSize, margin: margin }} color='primary' />
      </Tooltip>
    </>
  );
};

export default InfoTooltip;
