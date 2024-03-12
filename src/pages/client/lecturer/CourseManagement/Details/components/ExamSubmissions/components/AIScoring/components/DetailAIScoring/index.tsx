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
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import TextEditor from "components/editor/TextEditor";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import { routes } from "routes/routes";
import ParagraphSmall from "components/text/ParagraphSmall";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import useBoxDimensions from "hooks/useBoxDimensions";
import ReactQuill from "react-quill";
import Heading2 from "components/text/Heading2";

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
  const [open, setOpen] = React.useState(true);
  const [assignmentTypes, setAssignmentTypes] = React.useState(["Tự luận"]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [loading, setLoading] = React.useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = React.useState("");
  const [assignmentStudent, setAssignmentStudent] =
    React.useState(`Đầu tiên và trước hết, hãy nhìn xem thế giới xã hội ngày nay, chúng ta đang sống trong một thời đại với những tiến bộ công nghệ vô cùng đột phá. Tuy nhiên, giữa những máy tính thông minh, robot tự động, và các ứng dụng di động, một yếu tố quan trọng không thể thiếu đó chính là sức mạnh của Tình người.

  Tình người không chỉ là khía cạnh chủ độn t45ng mối quan hệ cá nhân mà còn thể hiện sự tương tác tích cực trong cộng đồng và xã hội. Điều này làm nổi bật bản chất của con người, tạo nên những kết nối mạnh mẽ giữa các thành viên trong xã hội, từng cá nhân trở thành một phần không thể tách rời của cộng đồng.
  
  Một trong những điều quan trọng nhất mà sức mạnh của Tình người mang lại là khả năng tạo ra sự hiểu biết và đồng cảm. Trong khi công nghệ có thể kết nối chúng ta với nhau qua mạng, tình người là yếu tố tạo nên sự gắn kết và sự hiểu biết sâu sắc. Có khả năng cảm nhận và chia sẻ niềm vui, nỗi buồn, khó khăn và thành công với người khác giúp tạo nên một môi trường xã hội tích cực và hỗ trợ.
  
  Mặc dù công nghệ có thể tạo ra sự kết nối ảo, nhưng sức mạnh của Tình người xuất phát từ những hành động thực tế. Việc hiện diện và hỗ trợ nhau trong cuộc sống hàng ngày tạo ra sự chắc chắn và ổn định cho cộng đồng. Đây không chỉ là một biểu hiện của lòng nhân ái mà còn là cơ sở của sự phát triển bền vững.
  
  Tình người còn là yếu tố động viên mạnh mẽ, thúc đẩy con người vượt qua những thách thức và khó khăn. Trong một xã hội hiện đại nơi áp lực và stress ngày càng gia tăng, sự hỗ trợ và đồng lòng từ cộng đồng có thể giúp mỗi cá nhân vượt qua khó khăn và phát triển tốt hơn.
  
  Cuối cùng, để tận dụng đầy đủ sức mạnh của Tình người, chúng ta cần xây dựng và duy trì một môi trường xã hội tích cực, nơi mà mọi người cảm thấy được chấp nhận, đánh giá, và được hỗ trợ. Sự tương tác tích cực giữa con người không chỉ là yếu tố tạo ra hạnh phúc mà còn là chìa khóa cho sự phát triển toàn diện của mỗi thành viên trong xã hội.
  
  Tóm lại, sức mạnh của Tình người không chỉ là vẻ đẹp ẩn sau các mối quan hệ cá nhân, mà còn là nguồn động viên và sức mạnh tạo nên cộng đồng mạnh mẽ và phồn thịnh trong xã hội hiện đại. Để xây dựng một thế giới tốt đẹp hơn, chúng ta cần hiểu và tôn trọng sức mạnh này, tạo điều kiện cho nó phát triển và lan tỏa trong mọi khía cạnh của cuộc sống.`);
  const [assignmentSubmissionStudent, setAssignmentSubmissionStudent] = React.useState("0");

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

  const location = useLocation();
  const feedback = location?.state.feedback;

  React.useEffect(() => {
    if (feedback) {
      console.log(feedback);
      setAssignmentFeedback(feedback?.feedback.join("\n"));
      setAssignmentMaximumGrade(feedback?.current_final_grade);
    }
  }, [feedback]);

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.container}
        sx={{
          marginTop: `${headerHeight}px`
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
                onClick={() => navigate(routes.lecturer.course.management)}
              >
                Quản lý khoá học
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.information)}
              >
                CS202 - Nhập môn lập trình
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.assignment)}
              >
                Danh sách bài tập
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.detail)}
              >
                Bài kiểm tra cuối kỳ
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
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
            marginTop: `${header2Height}px`
          }}
        >
          <Heading2>Câu hỏi 2: Con trỏ là gì?</Heading2>
          <Card className={classes.card}>
            <ReactQuill
              style={{ height: `calc(100vh - ${250}px` }}
              value={assignmentStudent}
              readOnly={true}
            />
          </Card>
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
              <TextTitle>Điểm trên thang điểm 100</TextTitle>
              <InputTextField
                type='number'
                value={assignmentMaximumGrade}
                onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                placeholder='Nhập điểm tối đa'
                fullWidth
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle>Nhận xét</TextTitle>
              <Box className={classes.textEditor}>
                <TextEditor
                  style={{
                    marginTop: "10px"
                  }}
                  value={assignmentFeedback}
                  onChange={setAssignmentFeedback}
                />
              </Box>
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
