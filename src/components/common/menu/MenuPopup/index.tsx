import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu, Props } from "material-ui-popup-state";
import Button, { BtnType } from "components/common/buttons/Button";
import { Box } from "@mui/material";

interface MenuPopupProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  popupId?: string;
  popupProps?: Props;
  triggerButtonText: string;
  triggerButtonProps?: React.ComponentProps<typeof Button>;
  menuItems: { label: string; onClick?: (popupState: any) => void }[];
  btnType: BtnType;
}

const MenuPopup = ({
  popupId,
  popupProps,
  triggerButtonText,
  triggerButtonProps,
  menuItems,
  btnType,
  ...props
}: MenuPopupProps) => {
  return (
    <Box {...props}>
      <PopupState variant='popover' popupId={popupId ?? "menu-popup"} {...popupProps}>
        {(popupState) => (
          <React.Fragment>
            <Button {...bindTrigger(popupState)} btnType={btnType} {...triggerButtonProps}>
              {triggerButtonText}
            </Button>
            <Menu {...bindMenu(popupState)}>
              {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={() => item.onClick?.(popupState)}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    </Box>
  );
};

export default MenuPopup;
