import { memo } from "react";
import { ButtonProps as ButtonPropsMUI } from "@mui/material";
import clsx from "clsx";
import classes from "./styles.module.scss";
import LoadingButton from "@mui/lab/LoadingButton";
import { BtnType } from "../Button";

interface ButtonProps extends ButtonPropsMUI {
  btnType?: BtnType;
  width?: string;
  padding?: string;
  nowrap?: boolean;
  loading?: boolean;
  colorName?: string;
  fontWeight?: number | string;
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
      sx={{
        ...sx,
        width: width,
        padding: padding,
        whiteSpace: nowrap ? "nowrap" : "unset",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: props.fontWeight || 400,
        fontSize: "16px",
        color: `var(${props.colorName})`,
        lineHeight: "24px"
      }}
      {...rest}
    >
      {children}
    </LoadingButton>
  );
});
export default LoadButton;
