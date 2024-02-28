import { memo } from "react";
import { Button as ButtonMUI, ButtonProps as ButtonPropsMUI } from "@mui/material";
import clsx from "clsx";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";

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
  borderRadius?: string;
}

const Button = memo((props: ButtonProps) => {
  const {
    width,
    padding,
    className,
    btnType,
    children,
    nowrap,
    borderRadius,
    sx = {},
    ...rest
  } = props;
  return (
    <ButtonMUI
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
      type='button'
      {...rest}
      sx={{
        ...sx,
        width: width,
        padding: padding,
        whiteSpace: nowrap ? "nowrap" : "unset",
        borderRadius: borderRadius
      }}
    >
      <ParagraphBody>{children}</ParagraphBody>
    </ButtonMUI>
  );
});
export default Button;
