import { Box, Grid } from "@mui/material";
import SnackbarAlert, { AlertType } from "components/common/SnackbarAlert";
import Heading4 from "components/text/Heading4";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./styles.module.scss";
import ParagraphSmall from "components/text/ParagraphSmall";

const ContestEditDetails = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openSnackbarAlert, setOpenSnackbarAlert] = useState(false);
  const [type, setType] = useState<AlertType>(AlertType.INFO);
  const [content, setContent] = useState("");

  return (
    <>
      <SnackbarAlert
        open={openSnackbarAlert}
        setOpen={setOpenSnackbarAlert}
        type={type}
        content={content}
      />
      <Grid container spacing={2} direction='column' className={classes.container}>
        <Grid item xs={12}>
          <Heading4 translate-key='contest_details'>{t("contest_details")}</Heading4>
          <ParagraphSmall fontStyle={"italic"} sx={{ marginTop: "10px" }}>
            Customize your contest by providing more information needed to create your contest
            details page.
          </ParagraphSmall>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </>
  );
};

export default ContestEditDetails;
