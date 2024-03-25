import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Stack, Typography } from "@mui/material";
import classes from "./styles.module.scss";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
export interface GradingConfigItems {
  label: string;
  value: string;
}
interface GradingConfigSelectProps {
  items: GradingConfigItems[];
  changeItemHandler: (value: string) => void;
  defaultValue: string;
  label: string;
  showIcon?: boolean;
  iconDescription?: string;
}

const GradingConfigSelect = ({
  items,
  changeItemHandler,
  defaultValue,
  label,
  showIcon,
  iconDescription
}: GradingConfigSelectProps) => {
  const handleChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
    changeItemHandler(newValue as string);
  };

  return (
    <>
      <Stack direction='row' spacing={0.8} alignItems={"center"}>
        <Typography className={classes.selectLabel}>{label}</Typography>
        {showIcon && (
          <Tooltip title={iconDescription} placement='top' arrow>
            <InfoIcon sx={{ fontSize: 15 }} color='primary' />
          </Tooltip>
        )}
      </Stack>
      <Select defaultValue={defaultValue} onChange={handleChange}>
        {items.map((item, index) => (
          <Option key={index} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default GradingConfigSelect;
