import { memo } from "react";
import { ButtonProps as ButtonPropsMUI } from "@mui/material";
import clsx from "clsx";
import classes from "./styles.module.scss";
import LoadingButton from "@mui/lab/LoadingButton";

export enum BtnType {
  Primary = "Primary",
  Secondary = "Secondary",
  Outlined = "Outlined",
  Text = "Text"
}

interface ButtonProps extends ButtonPropsMUI {
  btnType?: BtnType;
  width?: string;
  padding?: string;
  nowrap?: boolean;
  loading?: boolean;
}

const LoadButton = memo((props: ButtonProps) => {
  const { width, padding, className, btnType, children, nowrap, sx = {}, ...rest } = props;
  return (
    <LoadingButton
      className={clsx(
        classes.btnRoot,
        {
          [classes.btnPrimary]: btnType === BtnType.Primary,
          [classes.btnSecondary]: btnType === BtnType.Secondary,
          [classes.btnOutlined]: btnType === BtnType.Outlined,
          [classes.btnText]: btnType === BtnType.Text
        },
        className
      )}
      loading={props.loading}
      sx={{ ...sx, minWidth: width, padding: padding, whiteSpace: nowrap ? "nowrap" : "unset" }}
      {...rest}
    >
      {children}
    </LoadingButton>
  );
});
export default LoadButton;
