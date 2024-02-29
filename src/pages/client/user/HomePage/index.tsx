import { Box, Button, CardMedia, Container, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import Heading3 from "components/text/Heading3";
import { Card, CardContent, Typography } from "@mui/material";
import images from "config/images";
import StarIcon from "@mui/icons-material/Star";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <Grid className={classes.root}>
      <Header />
      <main>
        <Container className={classes.container}>
          <Grid container columnSpacing={5} className={classes.sectionContentImage}>
            <Grid item xs={6} className={classes.sectionContent}>
              <Box className={classes.customListContainer}>
                <Heading1 className={classes.mainHeading}>
                  Hãy học lập trình ngay từ hôm nay
                </Heading1>
                <ParagraphBody className={classes.mainParagraph}>
                  6Bros là nơi bạn có thể học lập trình một cách dễ dàng và hiệu quả
                </ParagraphBody>
                <Button className={classes.createAccountBtn} variant='contained' color='primary'>
                  Tạo tài khoản
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} className={classes.sectionImage}>
              <img className={classes.homeImage} src={images.home} alt='home' />
            </Grid>
          </Grid>
          <Grid container>
            <Container className={classes.courseContainer}>
              <Grid item xs={12} className={classes.courseContent}>
                <Heading3 className={classes.courseHeading}>Các ngôn ngữ</Heading3>
                <Grid container spacing={2} className={classes.centerContainer}>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://www.inovex.de/wp-content/uploads/2021/04/training-python.png'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Học Python
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của Python để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Cơ bản</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>1.1k</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.4</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/306px-ISO_C%2B%2B_Logo.svg.png'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Học C++
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của C++ để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Cơ bản</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>2.5k</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.8</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://1000logos.net/wp-content/uploads/2020/09/Java-Emblem.jpg'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Học Java
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của Java để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Cơ bản</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>500</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.1</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.courseContent}>
                <Heading3 className={classes.courseHeading}>
                  Cấu trúc dữ liệu và giải thuật
                </Heading3>
                <Grid container spacing={2} className={classes.centerContainer}>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://res.cloudinary.com/dpessyoae/image/upload/v1494083335/linkedlist3_fsadk8.png'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Danh sách liên kết
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của Python để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Trung bình</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>3.2k</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.9</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://fullyunderstood.com/wp-content/uploads/2019/09/Binary-Search.png'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Cây nhị phân
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của C++ để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Trung bình</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>824</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.2</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia
                        component='img'
                        height='140'
                        image='https://oxsci.org/wp-content/uploads/2023/07/Screenshot-2023-07-19-at-17.23.38-e1689799077772.png'
                      />
                      <CardContent className={classes.courseCard}>
                        <Typography gutterBottom variant='h5' component='div'>
                          Thuật toán sắp xếp
                        </Typography>

                        <Typography variant='body2' color='text.secondary'>
                          Có được trải nghiệm và nắm vững cú pháp cơ bản của Java để bắt đầu hành
                          trình lập trình của bạn
                        </Typography>
                        <Box className={classes.iconCourse}>
                          <img
                            src={images.icLevel}
                            alt='icon level'
                            className={classes.iconLevel}
                          />
                          <ParagraphBody>Trung bình</ParagraphBody>
                        </Box>
                        <Box className={classes.courseDetail}>
                          <Box className={classes.userLearning}>
                            <ParagraphBody>1.5k</ParagraphBody>
                            <FontAwesomeIcon icon={faUser} className={classes.icUser} />
                          </Box>
                          <Box className={classes.userRating}>
                            <ParagraphBody>4.7</ParagraphBody>
                            <StarIcon className={classes.icStar} />
                          </Box>
                        </Box>
                        <Button
                          className={classes.viewDetailBtn}
                          fullWidth
                          variant='outlined'
                          color='primary'
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Box className={classes.viewAllBtn}>
                <Button variant='contained' color='primary'>
                  Xem tất cả
                </Button>
              </Box>
            </Container>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
}
