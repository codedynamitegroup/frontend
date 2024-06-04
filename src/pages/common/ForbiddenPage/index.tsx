import { Box, Button } from "@mui/material";
import images from "config/images";
import classes from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import Heading3 from "components/text/Heading3";
import Heading4 from "components/text/Heading4";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className={classes.boxWrap}>
      <Box className={classes.unauthorizedBox}>
        <img src={images.error.forbiddenError} alt='Unauthorized img' />
      </Box>
      <Heading3>Dừng lại</Heading3>
      <Heading4>Bạn không có quyền truy cập vào trang này</Heading4>
      <Button onClick={handleBack} variant='contained' sx={{ mt: 2, width: 200, height: 50 }}>
        Quay về
      </Button>
    </Box>
  );
};

export default ForbiddenPage;
