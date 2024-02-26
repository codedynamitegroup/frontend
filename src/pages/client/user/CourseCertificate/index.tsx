import Header from "components/Header";
import { Box, Container, Divider, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading2 from "components/text/Heading2";
import SearchBar from "components/common/search/SearchBar";
import BasicSelect from "components/common/select/BasicSelect";
import React from "react";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphBody from "components/text/ParagraphBody";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heading3 from "components/text/Heading3";
import images from "config/images";

const CourseCertificates = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };

  const [assignmentSection, setAssignmentSection] = React.useState("0");

  return (
    <Grid className={classes.root}>
      <Header />
      <main>
        <Box id={classes.banner}>
          <Container id={classes.bannerContainer}>
            <Heading2 colorName={"--white"}>
              Bạn muốn rèn luyện khả năng code của bạn ? Hãy thử các khóa học sau
            </Heading2>
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
                    label: "Tất cả"
                  },
                  {
                    value: "1",
                    label: "Kiến thức cơ sở"
                  },
                  {
                    value: "2",
                    label: "Rèn luyện thuật toán"
                  },
                  {
                    value: "3",
                    label: "Cấu trúc dữ liệu và giải thuật"
                  }
                ]}
                backgroundColor='#FFFFFF'
              />
            </Box>
          </Container>
        </Box>
        <Box mt={"40px"}>
          <Container>
            <Box id={classes.courseRecommendsWrapper}>
              <Heading2>Các khóa học được đề xuất</Heading2>
              <Grid container>
                <Grid item xs={3.65} className={classes.courseRecommend}>
                  <Grid item container className={classes.titleCourseRecommend}>
                    <Grid item xs={2} className={classes.imgCourseRecommend}>
                      <img
                        src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        alt='img course recommend'
                      />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid
                      item
                      xs={9}
                      container
                      direction={"column"}
                      spacing={1.5}
                      className={classes.titleCard}
                    >
                      <Grid item className={classes.topCard}>
                        <ParagraphBody>Học C++ cơ bản</ParagraphBody>
                      </Grid>
                      <Grid item className={classes.botCard}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box className={classes.contentCourseRecommend}>
                    <Button btnType={BtnType.Text}>
                      <ParagraphBody>Xem chi tiết</ParagraphBody>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={0.525}></Grid>
                <Grid item xs={3.65} className={classes.courseRecommend}>
                  <Grid item container className={classes.titleCourseRecommend}>
                    <Grid item xs={2} className={classes.imgCourseRecommend}>
                      <img
                        src='https://cdn.codechef.com/images/self-learning/icons/python.svg'
                        alt='img course recommend'
                      />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid
                      item
                      xs={9}
                      className={classes.titleCard}
                      container
                      direction={"column"}
                      spacing={1.5}
                    >
                      <Grid item className={classes.topCard}>
                        <ParagraphBody>Học Python cơ bản</ParagraphBody>
                      </Grid>
                      <Grid item className={classes.botCard}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box className={classes.contentCourseRecommend}>
                    <Button btnType={BtnType.Text}>
                      <ParagraphBody>Xem chi tiết</ParagraphBody>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={0.525}></Grid>
                <Grid item xs={3.65} className={classes.courseRecommend}>
                  <Grid item container className={classes.titleCourseRecommend}>
                    <Grid item xs={2} className={classes.imgCourseRecommend}>
                      <img
                        src='https://cdn.codechef.com/images/self-learning/icons/go.svg'
                        alt='img course recommend'
                      />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid
                      item
                      xs={9}
                      className={classes.titleCard}
                      container
                      direction={"column"}
                      spacing={1.5}
                    >
                      <Grid item className={classes.topCard}>
                        <ParagraphBody>Học Go cơ bản</ParagraphBody>
                      </Grid>
                      <Grid item className={classes.botCard}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box className={classes.contentCourseRecommend}>
                    <Button btnType={BtnType.Text}>
                      <ParagraphBody>Xem chi tiết</ParagraphBody>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
        <Divider sx={{ marginTop: "40px" }} />
        <Box mt={"40px"}>
          <Container>
            <Box id={classes.couseCertificatesWrapper}>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading2>Kiến thức cơ sở</Heading2>
                <Grid container>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Trung bình</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={0.525}></Grid>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={0.525}></Grid>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.couseCertificatesByTopic}>
                <Heading2>Kiến thức cơ sở</Heading2>
                <Grid container>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={0.525}></Grid>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid item xs={0.525}></Grid>
                  <Grid
                    item
                    xs={3.65}
                    container
                    direction={"column"}
                    className={classes.courseCerticate}
                  >
                    <Grid item container xs={4} className={classes.titleCourse}>
                      <Grid item xs={3} className={classes.imgCourse}>
                        <img
                          alt='img course'
                          src='https://cdn.codechef.com/images/self-learning/icons/cpp.svg'
                        />
                      </Grid>
                      <Grid item xs={9} className={classes.nameCourse}>
                        <Heading3>Học C++ Cơ bản</Heading3>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={4}>
                      <ParagraphBody className={classes.courseDescription}>
                        Practice problems of C++, the language most used for DSA and low level
                        programming due to its efficiency and speed.
                      </ParagraphBody>
                    </Grid>
                    <Grid item xs={1}>
                      <Divider />
                    </Grid>
                    <Grid item xs={2}>
                      <Box className={classes.iconCourse}>
                        <FontAwesomeIcon icon={faFile} className={classes.fileIcon} />
                        <ParagraphBody>67 bài học</ParagraphBody>
                      </Box>
                      <Box className={classes.iconCourse}>
                        <img src={images.icLevel} alt='icon level' className={classes.iconLevel} />
                        <ParagraphBody>Dễ</ParagraphBody>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Box>
      </main>
    </Grid>
  );
};

export default CourseCertificates;
