import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import JoyButton from "@mui/joy/Button";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import Heading3 from "components/text/Heading3";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import useBoxDimensions from "hooks/useBoxDimensions";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setErrorMess } from "reduxes/AppStatus";
import { setChapters } from "reduxes/coreService/Chapter";
import { routes } from "routes/routes";
import { ChapterService } from "services/coreService/ChapterService";
import { AppDispatch, RootState } from "store";
import classes from "./styles.module.scss";
import CodeQuestionLesson from "./components/CodeQuestionLesson";
import YouTubeVideo from "./components/YoutubeVideo";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";
import { CertificateCourseService } from "services/coreService/CertificateCourseService";
import ReactQuill from "react-quill";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
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
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
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

export default function Lessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isChapterExpanded, setIsChapterExpanded] = useState<{
    [key: string]: boolean;
  }>({});

  const chapterState = useSelector((state: RootState) => state.chapter);

  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const headerRef = React.useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  const header2Ref = React.useRef<HTMLDivElement>(null);
  const { height: header2Height } = useBoxDimensions({
    ref: header2Ref
  });

  const currentLesson = useMemo(() => {
    if (chapterState.chapters && chapterState.chapters.length > 0) {
      for (let i = 0; i < chapterState.chapters.length; i++) {
        if (chapterState.chapters[i].resources && chapterState.chapters[i].resources.length > 0) {
          for (let j = 0; j < chapterState.chapters[i].resources.length; j++) {
            if (chapterState.chapters[i].resources[j].chapterResourceId === lessonId) {
              return chapterState.chapters[i].resources[j];
            }
          }
        }
      }
    }
    return null;
  }, [chapterState.chapters, lessonId]);

  const handleGetChaptersByCertificateCourseId = useCallback(
    async (id: string) => {
      try {
        const getChaptersByCertificateCourseIdResponse =
          await ChapterService.getChaptersByCertificateCourseIdResponse(id);
        dispatch(setChapters(getChaptersByCertificateCourseIdResponse));
      } catch (error: any) {
        console.error("Failed to fetch chapters by certificate course id", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        dispatch(setErrorMess(error.response?.message || error.message));
      }
    },
    [dispatch]
  );

  const handleGetCertificateCourseById = useCallback(
    async (id: string) => {
      try {
        const getCertificateCourseByIdResponse =
          await CertificateCourseService.getCertificateCourseById(id);
        if (getCertificateCourseByIdResponse) {
          const certificateCourse = getCertificateCourseByIdResponse as CertificateCourseEntity;
          // Check if user is registered to the course
          if (certificateCourse.isRegistered !== true) {
            dispatch(setErrorMess(t("not_registered_certificate_course_message")));
            navigate(
              routes.user.course_certificate.detail.introduction
                .replace(":courseId", id)
                .replace("*", "")
            );
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch certificate course by id", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
        dispatch(setErrorMess(error.response?.message || error.message));
        navigate(
          routes.user.course_certificate.detail.introduction
            .replace(":courseId", id)
            .replace("*", "")
        );
      }
    },
    [dispatch, navigate, t]
  );

  const isPreviousButtonDisabled = useMemo(() => {
    for (let i = 0; i < chapterState.chapters.length; i++) {
      if (chapterState.chapters[i].resources && chapterState.chapters[i].resources.length > 0) {
        for (let j = 0; j < chapterState.chapters[i].resources.length; j++) {
          if (chapterState.chapters[i].resources[j].chapterResourceId === lessonId) {
            if (i === 0 && j === 0) {
              // Check if this is the first resource of the first chapter
              return true;
            } else if (j === 0 && chapterState.chapters[i - 1].resources.length > 0) {
              return false;
            } else if (j > 0) {
              // If this is not the first resource of the chapter, go to the previous resource
              return false;
            }
          }
        }
      }
    }
    return true;
  }, [chapterState.chapters, lessonId]);

  const isNextButtonDisabled = useMemo(() => {
    for (let i = 0; i < chapterState.chapters.length; i++) {
      if (chapterState.chapters[i].resources && chapterState.chapters[i].resources.length > 0) {
        for (let j = 0; j < chapterState.chapters[i].resources.length; j++) {
          if (chapterState.chapters[i].resources[j].chapterResourceId === lessonId) {
            if (
              i === chapterState.chapters.length - 1 &&
              j === chapterState.chapters[i].resources.length - 1
            ) {
              // Check if this is the last resource of the last chapter
              return true;
            } else if (
              j === chapterState.chapters[i].resources.length - 1 &&
              chapterState.chapters[i + 1].resources.length > 0
            ) {
              return false;
            } else if (j < chapterState.chapters[i].resources.length - 1) {
              // If this is not the last resource of the chapter, go to the next resource
              return false;
            } else {
              return true;
            }
          }
        }
      }
    }
    return true;
  }, [chapterState.chapters, lessonId]);

  useEffect(() => {
    // Initialize the chapter expanded state
    if (chapterState.chapters && chapterState.chapters.length > 0) {
      const newIsChapterExpanded: { [key: string]: boolean } = {};
      chapterState.chapters.forEach((chapter: ChapterEntity) => {
        newIsChapterExpanded[chapter.chapterId] = false;
        if (chapter.resources && chapter.resources.length > 0) {
          for (let i = 0; i < chapter.resources.length; i++) {
            if (chapter.resources[i].chapterResourceId === lessonId) {
              newIsChapterExpanded[chapter.chapterId] = true;
              break;
            }
          }
        }
      });
      setIsChapterExpanded(newIsChapterExpanded);
    }
  }, [chapterState.chapters, lessonId]);

  useEffect(() => {
    const fetchData = async () => {
      if (courseId) {
        await handleGetCertificateCourseById(courseId);
        await handleGetChaptersByCertificateCourseId(courseId);
      }
    };
    fetchData();
  }, [courseId, handleGetChaptersByCertificateCourseId, handleGetCertificateCourseById]);

  if (!courseId || !lessonId || !currentLesson) {
    return null;
  }
  return (
    <Grid className={classes.root}>
      <Header ref={headerRef} />
      <Box
        className={classes.container}
        sx={{
          marginTop: `${headerHeight + 1}px`
        }}
      >
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{
            top: `${headerHeight + 1}px`,
            backgroundColor: "white",
            boxShadow: "0px 2px 4px #00000026"
          }}
          ref={header2Ref}
          open={open}
        >
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={open ? handleDrawerClose : handleDrawerOpen}
            >
              <MenuIcon color='action' />
            </IconButton>
            <Divider
              orientation='vertical'
              flexItem
              sx={{
                marginLeft: 1
              }}
            />
            <JoyButton
              variant='plain'
              color='neutral'
              disabled={isPreviousButtonDisabled}
              startDecorator={
                <ArrowBackIosNewIcon
                  sx={{
                    width: "18px",
                    height: "18px"
                  }}
                />
              }
              onClick={() => {
                for (let i = 0; i < chapterState.chapters.length; i++) {
                  if (
                    chapterState.chapters[i].resources &&
                    chapterState.chapters[i].resources.length > 0
                  ) {
                    for (let j = 0; j < chapterState.chapters[i].resources.length; j++) {
                      if (chapterState.chapters[i].resources[j].chapterResourceId === lessonId) {
                        if (i === 0 && j === 0) {
                          // Check if this is the first resource of the first chapter
                          return;
                        } else if (j === 0 && chapterState.chapters[i - 1].resources.length > 0) {
                          // Check if this is the first resource of the non-first chapter
                          // Also check if previous chapter has resources. if not, do not navigate
                          const url =
                            chapterState.chapters[i - 1].resources[
                              chapterState.chapters[i - 1].resources.length - 1
                            ].resourceType === ResourceTypeEnum.CODE
                              ? routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i - 1].resources[
                                      chapterState.chapters[i - 1].resources.length - 1
                                    ].chapterResourceId
                                  )
                                  .replace("*", "")
                              : routes.user.course_certificate.detail.lesson.detail
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i - 1].resources[
                                      chapterState.chapters[i - 1].resources.length - 1
                                    ].chapterResourceId
                                  )
                                  .replace("*", "");
                          navigate(url);
                          return;
                        } else if (j > 0) {
                          // If this is not the first resource of the chapter, go to the previous resource
                          const url =
                            chapterState.chapters[i].resources[j - 1].resourceType ===
                            ResourceTypeEnum.CODE
                              ? routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i].resources[j - 1].chapterResourceId
                                  )
                                  .replace("*", "")
                              : routes.user.course_certificate.detail.lesson.detail
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i].resources[j - 1].chapterResourceId
                                  )
                                  .replace("*", "");
                          navigate(url);
                        }
                      }
                    }
                  }
                }
              }}
            >
              {t("common_previous")}
            </JoyButton>
            <JoyButton
              variant='plain'
              color='neutral'
              disabled={isNextButtonDisabled}
              endDecorator={
                <ArrowForwardIosIcon
                  sx={{
                    width: "18px",
                    height: "18px"
                  }}
                />
              }
              onClick={() => {
                for (let i = 0; i < chapterState.chapters.length; i++) {
                  if (
                    chapterState.chapters[i].resources &&
                    chapterState.chapters[i].resources.length > 0
                  ) {
                    for (let j = 0; j < chapterState.chapters[i].resources.length; j++) {
                      if (chapterState.chapters[i].resources[j].chapterResourceId === lessonId) {
                        if (
                          i === chapterState.chapters.length - 1 &&
                          j === chapterState.chapters[i].resources.length - 1
                        ) {
                          // Check if this is the last resource of the last chapter
                          return;
                        } else if (
                          j === chapterState.chapters[i].resources.length - 1 &&
                          chapterState.chapters[i + 1].resources.length > 0
                        ) {
                          // Check if this is the last resource of the non-last chapter
                          // Also check if next chapter has resources. if not, do not navigate
                          const url =
                            chapterState.chapters[i + 1].resources[0].resourceType ===
                            ResourceTypeEnum.CODE
                              ? routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i + 1].resources[0].chapterResourceId
                                  )
                                  .replace("*", "")
                              : routes.user.course_certificate.detail.lesson.detail
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i + 1].resources[0].chapterResourceId
                                  )
                                  .replace("*", "");
                          navigate(url);
                          return;
                        } else if (j < chapterState.chapters[i].resources.length - 1) {
                          // If this is not the last resource of the chapter, go to the next resource
                          const url =
                            chapterState.chapters[i].resources[j + 1].resourceType ===
                            ResourceTypeEnum.CODE
                              ? routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i].resources[j + 1].chapterResourceId
                                  )
                                  .replace("*", "")
                              : routes.user.course_certificate.detail.lesson.detail
                                  .replace(":courseId", courseId)
                                  .replace(
                                    ":lessonId",
                                    chapterState.chapters[i].resources[j + 1].chapterResourceId
                                  )
                                  .replace("*", "");
                          navigate(url);
                        }
                      }
                    }
                  }
                }
              }}
            >
              {t("common_next")}
            </JoyButton>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              marginTop: `${header2Height + 1}px`
              // marginTop: "65px"
            }
          }}
          variant='persistent'
          anchor='left'
          open={open}
        >
          <DrawerHeader>
            <JoyButton
              sx={{
                display: "flex",
                justifyContent: "flex-start"
              }}
              startDecorator={
                <ArrowBackIosNewIcon
                  sx={{
                    width: "18px",
                    height: "18px"
                  }}
                />
              }
              variant='plain'
              color='neutral'
              fullWidth
              onClick={() => {
                navigate(
                  routes.user.course_certificate.detail.lesson.root.replace(":courseId", courseId)
                );
              }}
            >
              {t("common_back_to_chapters")}
            </JoyButton>
          </DrawerHeader>
          <Divider />
          {chapterState.chapters &&
            chapterState.chapters.length > 0 &&
            isChapterExpanded &&
            Object.keys(isChapterExpanded).length > 0 &&
            chapterState.chapters.map((chapter: ChapterEntity, index: number) => {
              return (
                <Accordion
                  key={chapter.chapterId}
                  expanded={isChapterExpanded[chapter.chapterId] || false}
                  onChange={() => {
                    setIsChapterExpanded({
                      ...isChapterExpanded,
                      [chapter.chapterId]: !isChapterExpanded[chapter.chapterId]
                    });
                  }}
                  sx={{
                    backgroundColor: `${
                      chapter.resources && chapter.resources.length > 0
                        ? chapter.resources.some(
                            (resource) => resource.chapterResourceId === lessonId
                          )
                          ? "var(--gray-3)"
                          : "white"
                        : "white"
                    }`
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                  >
                    <Stack
                      direction='column'
                      spacing={1}
                      alignItems='flex-start'
                      justifyContent='space-between'
                    >
                      <TextTitle>{`${index + 1}. ${chapter.title}`}</TextTitle>
                      <ParagraphSmall className={classes.chapterDescription}>
                        {chapter.description}
                      </ParagraphSmall>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ToggleButtonGroup
                      orientation='vertical'
                      value={lessonId}
                      exclusive
                      onChange={(e, value) => {
                        if (value) {
                          const url =
                            chapter.resources.find(
                              (resource) => resource.chapterResourceId === value
                            )?.resourceType === ResourceTypeEnum.CODE
                              ? routes.user.course_certificate.detail.lesson.description
                                  .replace(":courseId", courseId)
                                  .replace(":lessonId", value)
                                  .replace("*", "")
                              : routes.user.course_certificate.detail.lesson.detail
                                  .replace(":courseId", courseId)
                                  .replace(":lessonId", value)
                                  .replace("*", "");
                          navigate(url, {
                            replace: true
                          });
                        }
                      }}
                      aria-label='Platform'
                      fullWidth
                    >
                      {chapter.resources.map((resource, index) => (
                        <ToggleButton
                          key={resource.chapterResourceId}
                          value={resource.chapterResourceId}
                          sx={{
                            border: "none",
                            justifyContent: "flex-start",
                            textTransform: "capitalize",
                            textAlign: "left"
                          }}
                        >
                          <Stack
                            direction='row'
                            gap={2}
                            alignItems='center'
                            justifyContent='flex-start'
                          >
                            {resource.isCompleted === true ? (
                              <CheckCircleIcon className={classes.icCheck} />
                            ) : resource.resourceType === ResourceTypeEnum.CODE ? (
                              <CodeIcon className={classes.icCode} />
                            ) : resource.resourceType === ResourceTypeEnum.VIDEO ? (
                              <OndemandVideoIcon className={classes.icVideo} />
                            ) : (
                              <ArticleIcon className={classes.icArticle} />
                            )}
                            <ParagraphSmall className={classes.chapterDescription}>
                              {resource?.title || ""}
                            </ParagraphSmall>
                          </Stack>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Drawer>
        <Main
          open={open}
          sx={{
            height: "100%",
            overflow: "auto"
          }}
        >
          <DrawerHeader />
          <Card
            sx={{
              padding: "20px",
              width: "100%"
            }}
          >
            {currentLesson.resourceType === ResourceTypeEnum.CODE ? (
              <Box>
                <Stack
                  direction='row'
                  gap={2}
                  alignItems='center'
                  justifyContent='flex-start'
                  sx={{
                    marginBottom: "10px"
                  }}
                >
                  <CodeIcon className={classes.icCode} />
                  <Heading3>{currentLesson.title}</Heading3>
                </Stack>
                <Divider
                  sx={{
                    marginY: "10px"
                  }}
                />
                <CodeQuestionLesson lesson={currentLesson} />
              </Box>
            ) : currentLesson.resourceType === ResourceTypeEnum.VIDEO ? (
              <Box>
                <Stack
                  direction='row'
                  gap={2}
                  alignItems='center'
                  justifyContent='flex-start'
                  sx={{
                    marginBottom: "10px"
                  }}
                >
                  <OndemandVideoIcon className={classes.icVideo} />
                  <Heading3>{currentLesson.title}</Heading3>
                </Stack>
                <Divider
                  sx={{
                    marginY: "10px"
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <YouTubeVideo url={currentLesson.youtubeVideoUrl || ""} />
                </Box>
              </Box>
            ) : (
              <Box>
                <Stack
                  direction='row'
                  gap={2}
                  alignItems='center'
                  justifyContent='flex-start'
                  sx={{
                    marginBottom: "10px"
                  }}
                >
                  <ArticleIcon className={classes.icArticle} />
                  <Heading3>{currentLesson.title}</Heading3>
                </Stack>
                <Divider
                  sx={{
                    marginY: "10px"
                  }}
                />
                <ReactQuill
                  value={currentLesson?.lessonHtml ?? ""}
                  readOnly={true}
                  theme={"bubble"}
                />
              </Box>
            )}
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
