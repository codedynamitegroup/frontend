import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Card, Divider, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Heading1 from "components/text/Heading1";
import { useCallback, useEffect, useState } from "react";
import UserRecentSharedSolution from "./components/UserRecentSharedSolution";
import UserRecentCodeQuestion from "./components/UserRecentCodeQuestion";
import classes from "./styles.module.scss";
import CustomHeatMap from "components/heatmap/CustomHeatMap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { setErrorMess } from "reduxes/AppStatus";
import { PaginationList } from "models/general";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

export enum ETab {
  PROBLEM = 0,
  SHARED_SOLUTION = 1
}

export enum ESharedSolutionType {
  RECENT = 0,
  MOST_COMMENT = 1
}

const UserRecentActivities = () => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState<ETab>(ETab.PROBLEM);
  const [sharedSolutionTypeIndex, setSharedSolutionTypeIndex] = useState<ESharedSolutionType>(
    ESharedSolutionType.RECENT
  );

  const [heatMapData, setHeatMapData] = useState<
    {
      date: string;
      count: number;
    }[]
  >([]);
  const [isLoadingCertificatesCompleted, setIsLoadingCertificatesCompleted] =
    useState<boolean>(false);
  const [certificatesCompleted, setCertificatesCompleted] = useState<
    PaginationList<CertificateCourseEntity>
  >({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });

  const dispatch = useDispatch();

  const handleGetHeatMap = useCallback(
    async ({ year = 2024 }: { year?: number }) => {
      try {
        const getHeatMapResponse = await CodeSubmissionService.getHeatMap(year);
        const formattedData = getHeatMapResponse.map((item: any) => ({
          date: item.date,
          count: item.numOfSubmission
        }));
        setHeatMapData(formattedData);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
    },
    [dispatch, t]
  );

  useEffect(() => {
    const fetchRecentHeatMap = async () => {
      // dispatch(setInititalLoading(true));
      await handleGetHeatMap({});
      // dispatch(setInititalLoading(false));
    };

    fetchRecentHeatMap();
  }, [dispatch, handleGetHeatMap]);

  // const handleGetMyCompletedCerCourse = useCallback(
  //   async ({ pageNo = 0, pageSize = 4 }) => {
  //     setIsLoadingCertificatesCompleted(true);
  //     try {
  //       const getMyCompletedCerCourseResponse =
  //         await CertificateCourseService.getMyCompletedCertificateCourses();
  //       setCertificatesCompleted({
  //         currentPage: getMyCompletedCerCourseResponse.currentPage,
  //         totalItems: getMyCompletedCerCourseResponse.totalItems,
  //         totalPages: getMyCompletedCerCourseResponse.totalPages,
  //         items: getMyCompletedCerCourseResponse.certificateCourses
  //       });
  //     } catch (error: any) {
  //       console.error("error", error);
  //       if (error.code === 401 || error.code === 403) {
  //         dispatch(setErrorMess(t("common_please_login_to_continue")));
  //       }
  //     }
  //     setIsLoadingCertificatesCompleted(false);
  //   },
  //   [dispatch, t]
  // );

  // useEffect(() => {
  //   const fetchMyCompletedCerCourse = async () => {
  //     // dispatch(setInititalLoading(true));
  //     await handleGetMyCompletedCerCourse({});
  //     // dispatch(setInititalLoading(false));
  //   };

  //   fetchMyCompletedCerCourse();
  // }, [dispatch, handleGetMyCompletedCerCourse]);

  // const handlePageChangeCertificateCourses = (event: React.ChangeEvent<unknown>, value: number) => {
  //   setPageNo(value);
  //   handleGetMyCompletedCerCourse({ pageNo: pageNo - 1 });
  // };

  return (
    <Box>
      {/* <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px"
        }}
      >
        <Box className={classes.formBody}>
          <Heading1 fontWeight={"500"} translation-key='user_detail_completed_certification'>
            {t("user_detail_completed_certification")}
          </Heading1>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px"
            }}
          >
            {isLoadingCertificatesCompleted ? (
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
            ) : certificatesCompleted.items.length === 0 ? (
              <>
                <ParagraphBody translation-key='user_detail_non_certification'>
                  {t("user_detail_non_certification")}
                </ParagraphBody>
                <ParagraphBody translation-key='user_detail_get_certification' colorname='--blue-2'>
                  <Link
                    component={RouterLink}
                    to={routes.user.course_certificate.root}
                    className={classes.textLink}
                  >
                    {t("user_detail_get_certification")} <ChevronRightIcon />
                  </Link>
                </ParagraphBody>
              </>
            ) : (
              <Stack direction={"column"} gap={2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                    <TableBody>
                      {certificatesCompleted.items.map((course) => (
                        <StyledTableRow key={course.certificateCourseId}>
                          <StyledTableCell component='th' scope='row'>
                            <Stack direction={"row"} alignItems={"center"} gap={1}>
                              <Box className={classes.imgCourse}>
                                <img alt='img course' src={course?.topic?.thumbnailUrl} />
                              </Box>
                              <Grid className={classes.nameCourse}>
                                <Heading4>{course?.name || ""}</Heading4>
                              </Grid>
                            </Stack>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <CustomPagination
                    count={certificatesCompleted.totalPages}
                    page={pageNo}
                    handlePageChange={handlePageChangeCertificateCourses}
                    showFirstButton
                    showLastButton
                    size={"large"}
                  />
                </Grid>
              </Stack>
            )}
          </Box>
        </Box>
      </Card> */}

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px"
        }}
      >
        <Box className={classes.formBody}>
          <Heading1 fontWeight={"500"} translation-key='user_detail_activity_stats'>
            {t("user_detail_activity_stats")}
          </Heading1>
          <Divider />
          <CustomHeatMap value={heatMapData} />
        </Box>
      </Card>

      <Card
        sx={{
          height: "100%"
        }}
      >
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Heading1 fontWeight={"500"} translation-key='user_detail_recent_activity'>
            {t("user_detail_recent_activity")}
          </Heading1>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(e, newValue) => {
                setTabIndex(newValue);
              }}
            >
              <Tab
                label={t("user_detail_problem")}
                icon={<NoteAltIcon />}
                iconPosition='start'
                translation-key='user_detail_problem'
                value={ETab.PROBLEM}
              />
              <Tab
                label={t("user_detail_shared_solution")}
                icon={<AssignmentTurnedInIcon />}
                iconPosition='start'
                translation-key='user_detail_shared_solution'
                value={ETab.SHARED_SOLUTION}
              />
            </Tabs>
            {tabIndex === ETab.PROBLEM ? (
              <></>
            ) : (
              <Tabs
                value={sharedSolutionTypeIndex}
                onChange={(e, newValue) => {
                  setSharedSolutionTypeIndex(newValue);
                }}
              >
                <Tab
                  label={t("user_detail_recent")}
                  icon={<AccessTimeIcon fontSize='small' />}
                  value={ESharedSolutionType.RECENT}
                  iconPosition='start'
                  sx={{
                    fontSize: "12px"
                  }}
                  translation-key='user_detail_recent'
                />
                <Divider
                  orientation='vertical'
                  flexItem
                  sx={{
                    height: "25px",
                    margin: "auto"
                  }}
                />
                <Tab
                  label={t("user_detail_most_comment")}
                  icon={<WhatshotIcon fontSize='small' />}
                  iconPosition='start'
                  value={ESharedSolutionType.MOST_COMMENT}
                  sx={{
                    fontSize: "12px"
                  }}
                  translation-key='user_detail_most_comment'
                />
              </Tabs>
            )}
          </Box>
          {tabIndex === 0 ? (
            <UserRecentCodeQuestion />
          ) : (
            <UserRecentSharedSolution sharedSolutionType={sharedSolutionTypeIndex} />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default UserRecentActivities;
