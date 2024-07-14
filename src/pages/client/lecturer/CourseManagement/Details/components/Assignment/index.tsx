import { CircularProgress, Collapse, Grid, IconButton, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { BtnType } from "components/common/buttons/Button";
import MenuPopup from "components/common/menu/MenuPopup";
import SearchBar from "components/common/search/SearchBar";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import AssignmentResource, { ResourceType } from "./components/Resource";
import classes from "./styles.module.scss";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { ExamService } from "services/courseService/ExamService";
import { AssignmentService } from "services/courseService/AssignmentService";
import { clearExamCreate } from "reduxes/coreService/questionCreate";
import { clearSections, setLoadingSections, setSections } from "reduxes/courseService/section";
import { CourseService } from "services/courseService/CourseService";
import { ArrowDropDownIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import EditImageIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ECourseResourceType } from "models/courseService/course";
import { SectionService } from "services/courseService/SectionService";
import { SectionEntity } from "models/courseService/entity/SectionEntity";
import CloseIcon from "@mui/icons-material/Close";
import Heading2 from "components/text/Heading2";
import Heading5 from "components/text/Heading5";
import EditSectionDialog from "./components/EditSectionDialog";

const LecturerCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams<{ courseId: string }>();
  const sectionState = useSelector((state: RootState) => state.section);
  const [collapseOpen, setCollapseOpen] = useState<Array<Boolean>>([]);
  const [isOpenEditTitle, setIsOpenEditTitle] = useState<Array<Boolean>>([]);
  const [editSection, setEditSection] = useState<SectionEntity | null>(null);

  const handleGetSections = useCallback(async () => {
    if (!courseId || (sectionState.courseId === courseId && sectionState.sections.length > 0)) {
      return;
    }

    dispatch(setLoadingSections(true));
    try {
      const getSectionsResponse = await SectionService.getSectionsByCourseId(courseId);
      dispatch(setSections({ sections: getSectionsResponse.sections, courseId: courseId }));
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
    dispatch(setLoadingSections(false));
  }, [courseId, dispatch, sectionState.courseId, sectionState.sections]);

  useEffect(() => {
    handleGetSections();
  }, [courseId, handleGetSections]);

  const handleDeleteAssignment = useCallback(
    async (id: string) => {
      try {
        const response = await AssignmentService.deleteAssignment(id);
        if (response) {
          // const result = assignmentState.assignments.filter((e) => e.id !== id);
          // dispatch(setAssignments({ assignments: result }));
          dispatch(clearSections());
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const handleDeleteExam = useCallback(
    async (id: string) => {
      try {
        const response = await ExamService.deleteExam(id);
        if (response) {
          dispatch(clearSections());
          // const result = examState.exams.exams.filter((e) => e.id !== id);
          // dispatch(setExamList({ exams: result }));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const { t } = useTranslation();

  const navigate = useNavigate();

  const onCreateNewAssignment = (popupState: any) => {
    if (courseId) navigate(routes.lecturer.assignment.create.replace(":courseId", courseId));
    popupState.close();
  };

  const onCreateNewExam = (popupState: any) => {
    dispatch(clearExamCreate());
    if (courseId) navigate(routes.lecturer.exam.create.replace(":courseId", courseId));
    popupState.close();
  };
  const [isOpenEditSectionDialog, setOpenEditSectionDialog] = useState(false);

  const handleCloseEditSectionDialog = () => {
    setOpenEditSectionDialog(false);
  };

  const toggleItem = (index: number) => {
    if (collapseOpen[index] === undefined)
      setCollapseOpen((prevState: Array<Boolean>) => ({
        ...prevState,
        [index]: false
      }));
    else {
      setCollapseOpen((prevState: any) => ({
        ...prevState,
        [index]: !Boolean(prevState[index])
      }));
    }
  };

  // const onOpenReusedCourseResourceDialog = (popupState: any) => {
  //   setIsReusedCourseResourceOpen(true);
  //   popupState.close();
  // };

  // const onCloseReusedCourseResourceDialog = () => {
  //   setIsReusedCourseResourceOpen(false);
  // };

  // const [isReusedResourceOpen, setIsReusedResourceOpen] = useState(false);

  // const onOpenReusedResourceDialog = () => {
  //   setIsReusedCourseResourceOpen(false);
  //   setIsReusedResourceOpen(true);
  // };

  // const onCloseReusedResourceDialog = () => {
  //   setIsReusedCourseResourceOpen(false);
  //   setIsReusedResourceOpen(false);
  // };

  // const onBackReusedCourseResourceDialog = () => {
  //   setIsReusedCourseResourceOpen(true);
  //   setIsReusedResourceOpen(false);
  // };

  return (
    <>
      <Box className={classes.assignmentBody}>
        <Grid container>
          <Grid item xs={3}>
            <Heading1 translation-key='course_detail_assignment_list'>
              {t("course_detail_assignment_list")}
            </Heading1>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <MenuPopup
              popupId='add-question-popup'
              triggerButtonText={i18next.format(t("common_add_new"), "firstUppercase")}
              triggerButtonProps={{
                width: "150px"
              }}
              btnType={BtnType.Primary}
              menuItems={[
                {
                  label: t("course_lecturer_assignment_create_new_assignment"),
                  onClick: onCreateNewAssignment
                },
                {
                  label: t("course_lecturer_assignment_create_exam"),
                  onClick: onCreateNewExam
                }
                // {
                //   label: t("course_lecturer_assignment_reuse_resource"),
                //   onClick: onOpenReusedCourseResourceDialog
                // }
              ]}
              translation-key={[
                "common_add_new",
                "course_lecturer_assignment_create_new_assignment",
                "course_lecturer_assignment_create_exam",
                "course_lecturer_assignment_reuse_resource"
              ]}
            />
          </Grid>
        </Grid>
        <Box className={classes.assignmentsWrapper}>
          {sectionState.isLoading === false ? (
            <Grid item xs={12}>
              <Box margin={1} padding={0}>
                <Grid container className={classes.gridBodyContainer}>
                  <Grid item className={classes.topicWrapper} xs={12}>
                    {sectionState.sections.map((topic, index) => {
                      const isOpen =
                        collapseOpen[index] === undefined ? true : Boolean(collapseOpen[index]);

                      return (
                        <Box className={classes.generalInfo} key={index}>
                          <Box display='flex' alignItems='center' margin={1}>
                            {isOpen ? (
                              <IconButton
                                className={classes.iconButtonActive}
                                sx={{ padding: "5px" }}
                                onClick={() => toggleItem(index)}
                              >
                                <ArrowDropDownIcon style={{ fontSize: 20 }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                className={classes.iconButton}
                                sx={{ padding: "5px" }}
                                onClick={() => toggleItem(index)}
                              >
                                <ArrowRightIcon style={{ fontSize: 20 }} />
                              </IconButton>
                            )}
                            {isOpenEditTitle[index] === undefined || isOpenEditTitle[index] ? (
                              <Heading5>{topic.name}</Heading5>
                            ) : (
                              <TextField variant='standard' defaultValue={topic.name} />
                            )}
                            <Box>
                              {isOpenEditTitle[index] || isOpenEditTitle[index] === undefined ? (
                                <IconButton
                                  onClick={() => {
                                    setOpenEditSectionDialog(true);
                                    setEditSection(topic);
                                  }}
                                  className={classes.editTopicTitleImageContainer}
                                >
                                  <EditImageIcon />
                                </IconButton>
                              ) : (
                                <></>
                              )}
                            </Box>
                          </Box>
                          <Collapse
                            in={isOpen}
                            timeout='auto'
                            unmountOnExit
                            className={classes.collapse}
                          >
                            {topic.modules.map((resource, resourceIndex) =>
                              resource.typeModule === ECourseResourceType.assignment ? (
                                <AssignmentResource
                                  key={resource.moduleId}
                                  courseId={courseId}
                                  examId={resource.assignment?.id}
                                  resourceTitle={resource.assignment?.title}
                                  resourceOpenDate={resource.assignment?.timeOpen}
                                  resourceEndedDate={resource.assignment?.timeClose}
                                  intro={resource.assignment?.intro}
                                  type={ResourceType.assignment}
                                  onDelete={handleDeleteAssignment}
                                />
                              ) : (
                                <AssignmentResource
                                  key={resource.moduleId}
                                  courseId={courseId}
                                  examId={resource.exam?.id}
                                  resourceTitle={resource.exam?.name}
                                  resourceOpenDate={resource.exam?.timeOpen}
                                  resourceEndedDate={resource.exam?.timeClose}
                                  intro={resource.exam?.intro}
                                  type={ResourceType.exam}
                                  onDelete={handleDeleteExam}
                                />
                              )
                            )}
                          </Collapse>
                        </Box>
                      );
                    })}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "10px"
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
      {/* <ReusedCourseResourceDialog
        title={t("course_list_title")}
        onOpenReuseResourceDialog={onOpenReusedResourceDialog}
        open={isReusedCourseResourceOpen}
        handleClose={onCloseReusedCourseResourceDialog}
        translation-key='course_list_title'
      />
      <ReusedResourceDialog
        title={t("course_lecturer_resource_list")}
        open={isReusedResourceOpen}
        cancelText={t("common_back")}
        onHandleCancel={onBackReusedCourseResourceDialog}
        handleClose={onCloseReusedResourceDialog}
        translation-key={["course_lecturer_resource_list", "common_back"]}
      /> */}
      <EditSectionDialog
        section={editSection}
        open={isOpenEditSectionDialog}
        onClose={handleCloseEditSectionDialog}
      />
    </>
  );
};

export default LecturerCourseAssignment;
