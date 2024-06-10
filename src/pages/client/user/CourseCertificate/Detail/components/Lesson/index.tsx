import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import LessonAccordion from "pages/client/user/CourseCertificate/Detail/components/Lesson/components/LessonAccordion";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useTranslation } from "react-i18next";

const CourseCertificateLesson = ({ isRegistered }: { isRegistered: boolean }) => {
  const chapters = useSelector((state: RootState) => state.chapter.chapters);
  const { t } = useTranslation();

  return (
    <Box id={classes.certificateDetails}>
      <Heading1 colorname='--blue-600' translate-key='certificate_detail_chapter_resources'>
        {t("certificate_detail_chapter_resources")}
      </Heading1>
      {chapters.map((chapter, index) => (
        <LessonAccordion
          key={index}
          chapterNumber={index + 1}
          chapter={chapter}
          isExpanded={index === 0 ? true : false}
          isRegistered={true}
        />
      ))}
    </Box>
  );
};

export default CourseCertificateLesson;
