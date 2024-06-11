import { Box, Grid } from "@mui/material";
import images from "config/images";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
import { useTranslation } from "react-i18next";
import Heading2 from "components/text/Heading2";
type Props = {};

const CertificateDetails = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Box id={classes.certificateDetails}>
      <Grid container direction={"column"} alignItems={"center"}>
        <Grid item xs={12} md={6} id={classes.title}>
          <Heading2 colorname='--blue-500' translation-key='certificate_detail_certification_title'>
            {t("certificate_detail_certification_title")}
          </Heading2>
          <ParagraphBody translation-key='certificate_detail_certification_description'>
            {t("certificate_detail_certification_description")}
          </ParagraphBody>
        </Grid>
        <Grid item xs={12} md={6} id={classes.imgCertificate}>
          <img src={images.icCertificate} alt='certificate' />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CertificateDetails;
