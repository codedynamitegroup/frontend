import { Box } from "@mui/material";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import LessonAccordion, { Chapter } from "components/common/accordion/LessonAccordion";
type Props = {};

const CourseCertificateLesson = (props: Props) => {
  const chapters: Chapter[] = [
    {
      chapterTitle: "Outputting & Math Operators",
      chapterDescription:
        "Learn how to make C++ print whatever you want, and learn to use it as a basic calculator.",
      lessons: [
        { title: "Introducing printing - cout", url: "" },
        { title: "Printing on multiple lines", url: "" },
        { title: "Multiple prints using single cout", url: "" },
        { title: "Math Operators and overall code structure", url: "" }
      ]
    },
    {
      chapterTitle: "Variables and Data Types",
      chapterDescription: "Learn how to make C++ store data and manipulate them",
      lessons: [
        { title: "Introduction to Variables and Data Types", url: "" },
        { title: "Quiz on Variables", url: "" },
        { title: "More Data Types", url: "" }
      ]
    }
  ];

  return (
    <Box id={classes.certificateDetails}>
      <Heading1 colorName='--blue-600'>Các bài học ở khóa học</Heading1>
      {chapters.map((chapter, index) => (
        <LessonAccordion key={index} chapterNumber={index + 1} chapter={chapter} />
      ))}
    </Box>
  );
};

export default CourseCertificateLesson;
