import { Box, Checkbox, Container, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import SearchBar from "components/common/search/SearchBar";
import BasicSelect from "components/common/select/BasicSelect";
import React from "react";
import ParagraphBody from "components/text/ParagraphBody";
import Heading3 from "components/text/Heading3";
import images from "config/images";
import Heading1 from "components/text/Heading1";
import Heading4 from "components/text/Heading4";
import { useTranslation } from "react-i18next";
import CourseCertificateCard from "./components/CourseCertifcateCard";

export interface CourseCertificate {
  imgUrl: string;
  title: string;
  description?: string;
  level?: string;
  lesson?: number;
}

interface FilterByTopic {
  checked: boolean;
  title: string;
  courseNumber: number;
}

const CourseCertificates = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  const [assignmentSection, setAssignmentSection] = React.useState("0");

  const filterByTopics: FilterByTopic[] = [
    {
      checked: true,
      title: "Học C++",
      courseNumber: 10
    },
    {
      checked: false,
      title: "Học Java",
      courseNumber: 15
    },
    {
      checked: false,
      title: "Học Python",
      courseNumber: 20
    },
    {
      checked: false,
      title: "Học Javascript",
      courseNumber: 10
    },
    {
      checked: false,
      title: "Cấu trúc dữ liệu và giải thuật",
      courseNumber: 3
    },
    {
      checked: false,
      title: "Kỹ thuật lập trình",
      courseNumber: 5
    }
  ];

  const courseCertificatesBasic: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ cơ bản",
      description:
        "Practice problems of C++, the language most used for DSA and low level programming due to its efficiency and speed.",
      lesson: 10,
      level: "Dễ"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python cơ bản",
      description:
        "Practice Python problems, the language known for its simplicity and readability making it the best language for beginners..",
      lesson: 30,
      level: "Dễ"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go cơ bản",
      description:
        "Learn the basics of Go programming with ease in this interactive and practical course. This course will provide a good base to building real world applications in go.",
      lesson: 35,
      level: "Dễ"
    }
  ];

  const courseCertificatesAdvanced: CourseCertificate[] = [
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/cpp.svg",
      title: "Học C++ nâng cao",
      description:
        "Practice problems of C++, the language most used for DSA and low level programming due to its efficiency and speed.",
      lesson: 10,
      level: "Nâng cao"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/python.svg",
      title: "Học Python nâng cao",
      description:
        "Practice Python problems, the language known for its simplicity and readability making it the best language for beginners..",
      lesson: 15,
      level: "Nâng cao"
    },
    {
      imgUrl: "https://cdn.codechef.com/images/self-learning/icons/go.svg",
      title: "Học Go nâng cao",
      description:
        "Learn the basics of Go programming with ease in this interactive and practical course. This course will provide a good base to building real world applications in go.",
      lesson: 35,
      level: "Nâng cao"
    }
  ];

  const { t } = useTranslation();

  return (
    <>
      <Box
        id={classes.banner}
        sx={{
          backgroundImage: `url(${images.background.courseCertificatesBackground})`
        }}
      >
        <Container id={classes.bannerContainer} className={classes.container}>
          <Heading1 colorname={"--white"} translation-key='certificate_title'>
            {t("certificate_title")}
          </Heading1>
          <Heading3 colorname={"--white"} translation-key='certificate_description'>
            {t("certificate_description")}
          </Heading3>
          <Box id={classes.bannerSearch}>
            <SearchBar onSearchClick={searchHandle} />
            <BasicSelect
              labelId='select-assignment-section-label'
              value={assignmentSection}
              onHandleChange={(value) => setAssignmentSection(value)}
              sx={{ maxWidth: "200px" }}
              items={[
                {
                  value: "0",
                  label: t("common_all")
                },
                {
                  value: "1",
                  label: t("common_registered")
                },
                {
                  value: "2",
                  label: t("common_not_registered")
                }
              ]}
              backgroundColor='#FFFFFF'
              translation-key={["common_all", "common_registered", "common_not_registered"]}
            />
          </Box>
        </Container>
      </Box>
      <Box mt={"40px"}>
        <Container className={classes.container}>
          <Grid container>
            <Grid item xs={2.5} id={classes.filter}>
              <Heading3 translation-key='common_filter_by'>{t("common_filter_by")}</Heading3>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading4 translation-key='common_filter_topic'>
                  {t("common_filter_topic")}
                </Heading4>
                {filterByTopics.map((topic, index) => (
                  <Box className={classes.couseCertificatesByTopicItem} key={index}>
                    <Checkbox checked={topic.checked} className={classes.checkbox} />
                    <ParagraphBody className={classes.couseCertificatesByTopicTitle}>
                      {topic.title} <span>({topic.courseNumber})</span>
                    </ParagraphBody>
                  </Box>
                ))}
              </Box>
              <Box className={classes.couseCertificatesByTopic}></Box>
            </Grid>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={9}>
              <Box id={classes.couseCertificatesWrapper}>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading2 translation-key='certificate_basic'>{t("certificate_basic")}</Heading2>
                  <Grid container spacing={3}>
                    {courseCertificatesBasic.map((course, index) => (
                      <Grid item xs={4} key={index}>
                        <CourseCertificateCard course={course} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box className={classes.couseCertificatesByTopic}>
                  <Heading2 translation-key='certificate_advance'>
                    {t("certificate_advance")}
                  </Heading2>
                  <Grid container spacing={3}>
                    {courseCertificatesAdvanced.map((course, index) => (
                      <Grid item xs={4} key={index}>
                        <CourseCertificateCard course={course} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CourseCertificates;
