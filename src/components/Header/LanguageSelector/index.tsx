import { Box, Icon, SvgIcon } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import images from "config/images";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

const langList = ["en", "vi"];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const changeLanguageHandler = (nextLang: string, popupState: any) => {
    i18n.changeLanguage(nextLang);
    popupState.close();
    setCurrentLang(nextLang);
  };
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("i18nextLng") ? localStorage.getItem("i18nextLng") : "vi";
  });

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <>
          <Button variant='outlined' {...bindTrigger(popupState)} sx={{ width: "160px" }} fullWidth>
            <Box className={classes.currentLangContainer}>
              {currentLang === "vi" ? (
                <>
                  <img alt='upload' src={images.flagIcon.flagVietnam} className={classes.imgFile} />
                  {i18n.t("language_vn")}
                </>
              ) : (
                <>
                  <img alt='upload' src={images.flagIcon.flagUs} className={classes.imgFile} />
                  {i18n.t("language_us")}
                </>
              )}
            </Box>
          </Button>
          <Menu
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left"
            }}
            {...bindMenu(popupState)}
            sx={{ width: "inherit" }}
            className={classes.menuPopover}
          >
            {langList.map((language: string) => (
              <MenuItem onClick={() => changeLanguageHandler(language, popupState)}>
                {language === "en" ? (
                  <Box className={classes.currentLangContainer}>
                    <img alt='upload' src={images.flagIcon.flagUs} className={classes.imgFile} />
                    {i18n.t("language_us")}
                  </Box>
                ) : (
                  <Box className={classes.currentLangContainer}>
                    <img
                      alt='upload'
                      src={images.flagIcon.flagVietnam}
                      className={classes.imgFile}
                    />
                    {i18n.t("language_vn")}
                  </Box>
                )}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  );
};

export default LanguageSelector;
