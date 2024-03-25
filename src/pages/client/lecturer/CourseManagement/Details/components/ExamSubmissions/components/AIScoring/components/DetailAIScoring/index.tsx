import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import Header from "components/Header";
import { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import InputTextField from "components/common/inputs/InputTextField";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import useBoxDimensions from "hooks/useBoxDimensions";
import { Textarea } from "@mui/joy";
import MDEditor from "@uiw/react-md-editor";
import { EFeedbackGradedCriteriaRate, IFeedback, QuestionEssay } from "service/GradingEssayByAI";

const drawerWidth = 450;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: `calc(100% - ${drawerWidth}px)`,
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

export default function DetailAIScoring() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const feedback = JSON.parse(localStorage.getItem("feedback") || "{}");
  const answer = JSON.parse(localStorage.getItem("answer") || "{}");
  const question: QuestionEssay = JSON.parse(localStorage.getItem("question") || "{}");
  const [open, setOpen] = React.useState(true);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [loading, setLoading] = React.useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const [assignmentStudent, setAssignmentStudent] = React.useState(answer);
  function handleClick() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Auto close drawer when screen width < 1080 and open drawer when screen width > 1080
  React.useEffect(() => {
    if (width < 1080) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });

  React.useEffect(() => {
    if (feedback) {
      const feedbackTemp: IFeedback = feedback?.feedback;
      if (feedbackTemp) {
        const feedbackTemplate = `
#### 1. Nội dung (${feedbackTemp?.content?.score.toFixed(2)}/${(EFeedbackGradedCriteriaRate.CONTENT_FEEDBACK * question?.maxScore).toFixed(2)}):
${feedbackTemp?.content?.content}

#### 2. Hình thức (${feedbackTemp?.form?.score.toFixed(2)}/${(EFeedbackGradedCriteriaRate.FORM_FEEDBACK * question?.maxScore).toFixed(2)}):
${feedbackTemp?.form?.content}

#### 3. Phong cách (${feedbackTemp?.style?.score.toFixed(2)}/${(EFeedbackGradedCriteriaRate.STYLE_FEEDBACK * question?.maxScore).toFixed(2)}):
${feedbackTemp?.style?.content}

${feedbackTemp?.overall}
`;
        setAssignmentFeedback(feedbackTemplate);
      }
      setAssignmentMaximumGrade(feedback?.current_final_grade);
    }
  }, [feedback, question?.maxScore]);

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.container}
        sx={{
          marginTop: `${headerHeight}px`,
          height: `calc(100% - ${headerHeight}px)`
        }}
      >
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{
            top: `${headerHeight}px`,
            backgroundColor: "white"
          }}
          ref={header2Ref}
          open={open}
        >
          <Toolbar>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.submissions)}
              >
                Danh sách bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.ai_scroring)}
              >
                Chấm điểm AI
              </ParagraphSmall>{" "}
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Xem chi tiết</ParagraphSmall>
            </Box>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='end'
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: "none" }) }}
            >
              <MenuIcon color='action' />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main
          open={open}
          className={classes.mainContent}
          sx={{
            height: `calc(100% - ${header2Height}px)`,
            marginTop: `${header2Height}px`,
            overflow: "auto"
          }}
        >
          <Textarea
            value={question?.content}
            readOnly={true}
            minRows={2}
            maxRows={3}
            sx={{ backgroundColor: "white" }}
          />
          <Card className={classes.card}>
            <TextEditor value={assignmentStudent} readOnly={true} />
          </Card>
          <Box className={classes.textEditor} data-color-mode='light'>
            <MDEditor.Markdown source={assignmentFeedback} className={classes.markdown} />
          </Box>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: "fixed",
              top: `${headerHeight}px`,
              height: `calc(100% - ${headerHeight}px)`,
              overflowY: "hidden"
            }
          }}
          variant='persistent'
          anchor='right'
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box className={classes.drawerBody}>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Dạng bài tập</TextTitle>
              <Chip className={classes.chip} label='Tự luận' />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Sinh viên</TextTitle>
              <Box className={classes.name}>
                <TextTitle fontWeight={"500"}>{feedback.student_name}</TextTitle>
                <ParagraphBody colorname='--gray-50'>MSSV: 123456789</ParagraphBody>
              </Box>
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Điểm trên thang điểm {question?.maxScore}</TextTitle>
              <InputTextField
                type='number'
                value={assignmentMaximumGrade}
                onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                placeholder='Nhập điểm tối đa'
                fullWidth
              />
            </Box>
            <LoadButton
              btnType={BtnType.Outlined}
              fullWidth
              style={{ marginTop: "20px" }}
              padding='10px'
              loading={loading}
              onClick={handleClick}
            >
              Đánh giá
            </LoadButton>
          </Box>
        </Drawer>
      </Box>
    </Grid>
  );
}
