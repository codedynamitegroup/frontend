import { Box, Grid } from "@mui/material";
import images from "config/images";
import classes from "./styles.module.scss";
import ParagraphBody from "components/text/ParagraphBody";
import Heading1 from "components/text/Heading1";
type Props = {};

const CertificateDetails = (props: Props) => {
  return (
    <Box id={classes.certificateDetails}>
      <Grid container direction={"column"} alignItems={"center"}>
        <Grid item xs={12} md={6} id={classes.title}>
          <Heading1 colorName='--blue-600'>Chứng chỉ khóa học</Heading1>
          <ParagraphBody>
            Bạn sẽ nhận được chứng chỉ khóa học khi hoàn thành tối thiểu 85% nội dung khóa học
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
