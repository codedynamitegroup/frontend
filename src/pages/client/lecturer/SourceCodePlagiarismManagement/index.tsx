import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, CssBaseline, Grid, IconButton, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import Heading2 from "components/text/Heading2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import TextTitle from "components/text/TextTitle";

const drawerWidth = 450;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }),
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative"
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  })
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start"
}));

export default function LecturerSourceCodePlagiarismManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.container}
        sx={{
          marginTop: `${headerHeight + 20}px`
        }}
      >
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{
            // margin top to avoid appbar overlap with content
            marginTop: "64px",
            backgroundColor: "white"
          }}
          open={false}
        >
          <Toolbar>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.management)}
              >
                Quản lý khoá học
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.information)}
              >
                CS202 - Nhập môn lập trình
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.assignment)}
              >
                Danh sách bài tập
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.detail)}
              >
                Bài kiểm tra cuối kỳ
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorName='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.submissions)}
              >
                Danh sách bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorName='--blue-500'>Kiểm tra gian lận</ParagraphSmall>
            </Box>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='end'
              sx={{ display: "none" }}
            >
              <MenuIcon color='action' />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={true} className={classes.mainContent}>
          <DrawerHeader />
          <Card>
            <Box component='form' className={classes.formBody} autoComplete='off'>
              <Heading1>Câu hỏi code 1 - Bài kiểm tra cuối kỳ</Heading1>
              <ParagraphBody>Báo cáo phát hiện gian lận mã nguồn</ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <Card className={classes.cardWrapper}>
                    <Heading2 className={classes.cardTitleHeader}>Thông tin báo cáo</Heading2>
                    <Box className={classes.reportOpenTimeWrapper}>
                      <Tooltip title='Thời gian mở bài kiểm tra' placement='top'>
                        <FontAwesomeIcon icon={faCalendar} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>March 9, 2024 at 2:29 PM GMT+7</ParagraphBody>
                    </Box>
                    <Box className={classes.submissionsQuantity}>
                      <Tooltip title='Số lượng bài nộp' placement='top'>
                        <FontAwesomeIcon icon={faFile} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>2 bài nộp</ParagraphBody>
                    </Box>
                    <Box className={classes.codeLanguage}>
                      <Tooltip title='Ngôn ngữ lập trình' placement='top'>
                        <FontAwesomeIcon icon={faCode} color='#737373' size={"lg"} />
                      </Tooltip>
                      <ParagraphBody>Java</ParagraphBody>
                    </Box>
                    <TextTitle className={classes.labelTitle}>2 nhãn được phát hiện</TextTitle>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>Highest similarity</Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>Average similarity</Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card className={classes.cardWrapper}>Clusters</Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>Similarity distribution</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>Submissions</Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card className={classes.cardWrapper}>Clusters</Card>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
