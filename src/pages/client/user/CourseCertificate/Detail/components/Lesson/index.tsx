import { Box } from "@mui/material";
import LessonAccordion from "pages/client/user/CourseCertificate/Detail/components/Lesson/components/LessonAccordion";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "store";

const CourseCertificateLesson = ({
  // chapters,
  isRegistered
}: {
  // chapters: ChapterEntity[];
  isRegistered: boolean;
}) => {
  const { t } = useTranslation();
  const chapters = useSelector((state: RootState) => state.chapter.chapters);

  return (
    <Box id={classes.certificateDetails}>
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
