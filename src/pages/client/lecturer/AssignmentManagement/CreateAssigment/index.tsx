import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Card,
  Container,
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
import CustomDateTimePicker from "components/common/datetime/CustomDateTimePicker";
import ChipMultipleFilter from "components/common/filter/ChipMultipleFilter";
import InputTextField from "components/common/inputs/InputTextField";
import BasicSelect from "components/common/select/BasicSelect";
import FileUploader from "components/editor/FileUploader";
import TextEditor from "components/editor/TextEditor";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import useWindowDimensions from "hooks/useWindowDimensions";
import classes from "./styles.module.scss";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import moment, { Moment } from "moment";
import { ExtFile } from "@files-ui/react";

export default function AssignmentCreated() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [assignmentName, setAssignmentName] = React.useState("");
  const [assignmentDescription, setAssignmentDescription] = React.useState("");
  const [activityInstructions, setActivityInstructions] = React.useState("");
  const [assignmentTypes, setAssignmentTypes] = React.useState(["Tự luận", "Nộp tệp"]);
  const [assignmentMaximumGrade, setAssignmentMaximumGrade] = React.useState(100);
  const [assignmentAllowSubmissionFromDate, setAssignmentAllowSubmissionFromDate] =
    React.useState<Moment | null>(moment());
  const [assignmentSubmissionDueDate, setAssignmentSubmissionDueDate] =
    React.useState<Moment | null>(moment());
  const [assignmentSection, setAssignmentSection] = React.useState("0");
  const [loading, setLoading] = React.useState(false);
  const [assignmentAvailability, setAssignmentAvailability] = React.useState("0");
  const [extFiles, setExtFiles] = React.useState<ExtFile[]>([]);

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

  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        sx={{
          marginTop: `${headerHeight}px`
        }}
        className={classes.container}
      >
        <Container>
          <Toolbar className={classes.toolBar}>
            <Box id={classes.breadcumpWrapper}>
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.course.management)}
                translation-key='common_course_management'
              >
                {t("common_course_management")}
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
                translation-key='course_detail_assignment_list'
              >
                {t("course_detail_assignment_list")}
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                translation-key='assignment_management_create_assignment'
              >
                {t("assignment_management_create_assignment")}
              </ParagraphSmall>
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
          <Box
            className={classes.mainContent}
            sx={{
              height: `calc(100% - ${header2Height}px)`,
              marginTop: `${header2Height}px`
            }}
          >
            <Card>
              <Box component='form' className={classes.formBody} autoComplete='off'>
                <Heading1
                  fontWeight={"500"}
                  translation-key='assignment_management_create_assignment'
                >
                  {t("assignment_management_create_assignment")}
                </Heading1>
                <InputTextField
                  type='text'
                  title={t("common_assignment_name")}
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  placeholder={t("common_assignment_enter_name")}
                  translation-key={["common_assignment_name", "common_assignment_enter_name"]}
                />
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={3}>
                    <TextTitle translation-key='common_assignment_description'>
                      {t("common_assignment_description")}
                    </TextTitle>
                  </Grid>
                  <Grid item xs={9} className={classes.textEditor}>
                    <TextEditor value={assignmentDescription} onChange={setAssignmentDescription} />
                  </Grid>
                </Grid>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={3}>
                    <TextTitle translation-key='common_assignment_guide'>
                      {t("common_assignment_guide")}
                    </TextTitle>
                  </Grid>
                  <Grid item xs={9} className={classes.textEditor}>
                    <TextEditor value={activityInstructions} onChange={setActivityInstructions} />
                  </Grid>
                </Grid>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={3}>
                    <TextTitle translation-key='asingment_management_attach_file'>
                      {t("asingment_management_attach_file")}
                    </TextTitle>
                  </Grid>
                  <Grid item xs={9}>
                    <FileUploader extFiles={extFiles} setExtFiles={setExtFiles} />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
          {/* <Box className={classes.drawerBody}>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='course_lecturer_grading_assignment_type'>
                {t("course_lecturer_grading_assignment_type")}
              </TextTitle>
              <ChipMultipleFilter
                label=''
                defaultChipList={["Tự luận", "Nộp tệp"]}
                filterList={assignmentTypes}
                onFilterListChangeHandler={setAssignmentTypes}
                backgroundColor='#D9E2ED'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='assignment_management_max_score'>
                {t("assignment_management_max_score")}
              </TextTitle>
              <InputTextField
                type='number'
                value={assignmentMaximumGrade}
                onChange={(e) => setAssignmentMaximumGrade(parseInt(e.target.value))}
                placeholder='Nhập điểm tối đa'
                backgroundColor='#D9E2ED'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='asingment_management_allow_time'>
                {t("asingment_management_allow_time")}
              </TextTitle>
              <CustomDateTimePicker
                value={assignmentAllowSubmissionFromDate}
                onHandleValueChange={(newValue) => {
                  setAssignmentAllowSubmissionFromDate(newValue);
                }}
                backgroundColor='#D9E2ED'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='asingment_management_deadline'>
                {t("asingment_management_deadline")}
              </TextTitle>
              <CustomDateTimePicker
                value={assignmentSubmissionDueDate}
                onHandleValueChange={(newValue) => {
                  setAssignmentSubmissionDueDate(newValue);
                }}
                backgroundColor='#D9E2ED'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='common_filter_topic'>
                {t("common_filter_topic")}
              </TextTitle>
              <BasicSelect
                labelId='select-assignment-section-label'
                value={assignmentSection}
                onHandleChange={(value) => setAssignmentSection(value)}
                items={[
                  {
                    value: "0",
                    label: "Chủ đề 1"
                  },
                  {
                    value: "1",
                    label: "Chủ đề 2"
                  },
                  {
                    value: "2",
                    label: "Chủ đề 3"
                  }
                ]}
                backgroundColor='#D9E2ED'
              />
            </Box>
            <Box className={classes.drawerFieldContainer}>
              <TextTitle translation-key='asingment_management_possibility'>
                {t("asingment_management_possibility")}
              </TextTitle>
              <BasicSelect
                labelId='select-assignment-availability-label'
                value={assignmentAvailability}
                onHandleChange={(value) => setAssignmentAvailability(value)}
                items={[
                  {
                    value: "0",
                    label: t("asingment_management_possibility_show")
                  },
                  {
                    value: "1",
                    label: t("asingment_management_possibility_hind_can_not_access")
                  },
                  {
                    value: "2",
                    label: t("asingment_management_possibility_hide_can_access")
                  }
                ]}
                backgroundColor='#D9E2ED'
                translation-key={[
                  "asingment_management_possibility_show",
                  "asingment_management_possibility_hind_can_not_access",
                  "asingment_management_possibility_hide_can_access"
                ]}
              />
            </Box>
            <LoadButton
              btnType={BtnType.Outlined}
              fullWidth
              style={{ marginTop: "20px" }}
              padding='10px'
              loading={loading}
              onClick={handleClick}
              translation-key='assignment_management_create_assignment'
            >
              {t("assignment_management_create_assignment")}
            </LoadButton>
          </Box> */}
        </Container>
      </Box>
    </Grid>
  );
}
