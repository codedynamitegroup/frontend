import { Button, Card } from "@mui/joy";
import { Box } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface PropsData {
  errorTitle: string;
  debugInfo?: string;
  navLink?: string;
}

const CourseErrorPage = (props: PropsData) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { errorTitle, debugInfo, navLink } = props;

  const navigationHandle = () => {
    if (navLink) {
      navigate(navLink, {});
    } else {
      navigate("/", {});
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("course_error_page")}</title>
      </Helmet>

      <Heading1 color={"#212121"} fontWeight={"bolder"} gutterBottom>
        {t("course_error")}
      </Heading1>

      <Card color='danger' variant='soft'>
        <ParagraphBody fontSize={".875rem"} fontWeight={"500"} color={"#680505"}>
          {errorTitle}
        </ParagraphBody>
      </Card>

      <Box display={"flex"} justifyContent={"flex-end"} marginTop={"20px"}>
        <Button onClick={navigationHandle}>{t("common_continue")}</Button>
      </Box>
    </>
  );
};

export default CourseErrorPage;
