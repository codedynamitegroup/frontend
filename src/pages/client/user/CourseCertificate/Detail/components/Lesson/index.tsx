import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import LessonAccordion from "pages/client/user/CourseCertificate/Detail/components/Lesson/components/LessonAccordion";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useTranslation } from "react-i18next";
import Heading2 from "components/text/Heading2";

const CourseCertificateLesson = ({ isRegistered }: { isRegistered: boolean }) => {
  const chapters = useSelector((state: RootState) => state.chapter.chapters);
  const { t } = useTranslation();

  return (
    <Box id={classes.certificateDetails}>
      <Heading2 colorname='--blue-500' translate-key='certificate_detail_chapter_resources'>
        {t("certificate_detail_chapter_resources")}
      </Heading2>
      {chapters.map((chapter, index) => (
        <LessonAccordion
          key={index}
          chapterNumber={index + 1}
          chapter={chapter}
          isExpanded={index === 0 ? true : false}
          isRegistered={isRegistered}
        />
      ))}
    </Box>
  );
};

export default CourseCertificateLesson;
