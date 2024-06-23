import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Grid, Stack } from "@mui/material";
import Heading2 from "components/text/Heading2";
import ParagraphBody from "components/text/ParagraphBody";
import images from "config/images";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";

type Props = {
  isCompleted: boolean;
};

const CertificateDetails = ({ isCompleted }: Props) => {
  const { t } = useTranslation();

  return (
    <Box id={classes.certificateDetails}>
      <Grid container direction={"column"} alignItems={"center"}>
        <Grid item xs={12} md={6} id={classes.title}>
          <Heading2 colorname='--blue-500' translation-key='certificate_detail_certification_title'>
            {t("certificate_detail_certification_title")}
          </Heading2>
          {isCompleted ? (
            <Stack
              direction='row'
              spacing={1}
              sx={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <CheckCircleIcon
                htmlColor='#1BA94C'
                sx={{
                  width: "20px",
                  height: "20px"
                }}
              />
              <ParagraphBody translate-key='certificate_detail_certification_completed'>
                {t("certificate_detail_certification_completed")}
              </ParagraphBody>
            </Stack>
          ) : (
            <ParagraphBody translation-key='certificate_detail_certification_description'>
              {t("certificate_detail_certification_description")}
            </ParagraphBody>
          )}
        </Grid>
        <Grid item xs={12} md={6} id={classes.imgCertificate}>
          <img src={images.icCertificate} alt='certificate' />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CertificateDetails;
