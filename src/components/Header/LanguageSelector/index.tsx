import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import images from "config/images";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import ParagraphSmall from "components/text/ParagraphSmall";

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
          <Button
            {...bindTrigger(popupState)}
            sx={{ width: "160px", textTransform: "none" }}
            className={classes.btnLang}
            fullWidth
          >
            <Box className={classes.currentLangContainer}>
              {currentLang === "vi" ? (
                <>
                  <img alt='upload' src={images.flagIcon.flagVietnam} className={classes.imgFile} />
                  <ParagraphSmall fontWeight={600}>{i18n.t("language_vn")}</ParagraphSmall>
                </>
              ) : (
                <>
                  <img alt='upload' src={images.flagIcon.flagUs} className={classes.imgFile} />
                  <ParagraphSmall fontWeight={600}>{i18n.t("language_us")}</ParagraphSmall>
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
            {langList.map((language: string, index: number) => (
              <MenuItem onClick={() => changeLanguageHandler(language, popupState)} key={index}>
                {language === "en" ? (
                  <Box className={classes.currentLangContainer} translation-key='language_us'>
                    <img alt='upload' src={images.flagIcon.flagUs} className={classes.imgFile} />
                    {i18n.t("language_us")}
                  </Box>
                ) : (
                  <Box className={classes.currentLangContainer} translation-key='language_vn'>
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
