import classes from "./styles.module.scss";

import Box from "@mui/material/Box";
import { CircularProgress, Collapse, Grid, IconButton } from "@mui/material";
import Heading1 from "components/text/Heading1";
import AssignmentResource from "./Resource";
import { ResourceType } from "pages/client/lecturer/CourseManagement/Details/components/Assignment/components/Resource";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { SectionService } from "services/courseService/SectionService";
import { setLoadingSections, setSections } from "reduxes/courseService/section";
import { ArrowDropDownIcon, ArrowRightIcon } from "@mui/x-date-pickers";
import Heading5 from "components/text/Heading5";
import { ECourseResourceType } from "models/courseService/course";

const StudentCourseAssignment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams<{ courseId: string }>();
  const sectionState = useSelector((state: RootState) => state.section);
  const [collapseOpen, setCollapseOpen] = useState<Array<Boolean>>([]);
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

  const { t } = useTranslation();

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
  return (
    <Box className={classes.assignmentBody}>
      <Heading1 translation-key='course_detail_assignment_list'>
        {t("course_detail_assignment_list")}
      </Heading1>
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
                          <Heading5>{topic.name}</Heading5>
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
  );
};

export default StudentCourseAssignment;
