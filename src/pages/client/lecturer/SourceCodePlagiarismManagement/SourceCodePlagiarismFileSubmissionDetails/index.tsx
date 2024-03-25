import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BadgeIcon from "@mui/icons-material/Badge";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TollTwoToneIcon from "@mui/icons-material/TollTwoTone";
import TollIcon from "@mui/icons-material/Toll";
import { Box, Card, CssBaseline, Grid, IconButton, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import Button, { BtnType } from "components/common/buttons/Button";
import CodeEditor from "components/editor/CodeEditor";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFileWithFileScoring } from "reduxes/CodePlagiarism";
import { routes } from "routes/routes";
import { RootState } from "store";
import CircularProgressWithLabel from "../SourceCodePlagiarismOverview/components/FilePairsTable/components/CircularProgressWithLabel";
import SimilarityHistogram, {
  SimilarityHistogramField
} from "../SourceCodePlagiarismOverview/components/SimilarityHistogram";
import FileSubmissionsCompareFeatureBar from "./components/FeatureBar";
import classes from "./styles.module.scss";

// Clustering type.
enum ClusterRelation {
  SAME,
  DIFFERENT,
  NONE
}

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

export default function LecturerSourceCodePlagiarismFileSubmissionDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const { report, filteredPairs, filterdFiles, clusters } = codePlagiarismState;

  const currentSubmissionFile = React.useMemo(() => {
    const file = filterdFiles.find((file) => file.id.toString() === submissionId);
    if (!file) return undefined;

    const cluster = clusters.find((c) =>
      c.cluster.some((pair) => pair.leftFile.id === file.id || pair.rightFile.id === file.id)
    );

    return {
      ...file,
      cluster
    };
  }, [filterdFiles, submissionId, clusters]);

  const dataList = React.useMemo(() => {
    // Get pairs that contain the current file.
    const filePairs = [...filteredPairs].filter(
      (pair) =>
        pair.leftFile.id.toString() === currentSubmissionFile?.id.toString() ||
        pair.rightFile.id.toString() === currentSubmissionFile?.id.toString()
    );
    const result = filePairs.map((pair, index) => {
      // Get the other file.
      const otherFile =
        pair.leftFile.id === currentSubmissionFile?.id ? pair.rightFile : pair.leftFile;
      const otherFileWithFileScoring = getFileWithFileScoring(otherFile, filteredPairs);

      // Cluster of the other file.
      const otherCluster = clusters.find((c) =>
        // c.cluster.some((p) => p.leftFile.id === otherFile.id || p.rightFile.id === otherFile.id)
        c.cluster.some((p) => p.id === pair.id)
      );

      // If the other file is part of the cluster of the current file.
      const inSameCluster =
        currentSubmissionFile?.cluster && currentSubmissionFile?.cluster?.id === otherCluster?.id;

      // Determin the clustering relation.
      const relation = inSameCluster
        ? ClusterRelation.SAME
        : otherCluster
          ? ClusterRelation.DIFFERENT
          : ClusterRelation.NONE;

      return {
        id: otherFileWithFileScoring.id,
        orgUserId: otherFileWithFileScoring.extra.orgUserId,
        userFullName: otherFileWithFileScoring.extra.userFullName,
        labels: otherFileWithFileScoring.extra.labels,
        questionName: otherFileWithFileScoring.extra.questionName,
        createdAt: otherFileWithFileScoring.extra.createdAt,
        similarity: pair.similarity,
        cluster: {
          relation,
          id: otherCluster?.id
        },
        actions: {
          pairId: pair.id
        }
      };
    });
    // Sort by similarity.
    result.sort((a, b) => b.similarity - a.similarity);

    return result;
  }, [filteredPairs, clusters, currentSubmissionFile]);

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 10;
  const totalElement = dataList.length;

  const tableHeading: GridColDef[] = [
    {
      field: "orgUserId",
      headerName: "MSSV",
      width: 100,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "userFullName",
      headerName: "Tên sinh viên",
      width: 150,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "questionName",
      headerName: "Tiêu đề câu hỏi",
      flex: 1,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "createdAt",
      headerName: "Ngày nộp",
      flex: 1,
      renderCell: (params) => {
        return (
          <ParagraphBody>
            {new Date(params.value).toLocaleString() || t("code_plagiarism_not_updated")}
          </ParagraphBody>
        );
      }
    },
    {
      field: "similarity",
      headerName: "Độ tương đồng",
      flex: 1,
      renderCell: (params) => {
        return <CircularProgressWithLabel value={Number(params.value) * 100 || 0} />;
      }
    },
    {
      field: "cluster",
      headerName: "Nhóm",
      align: "center",
      width: 70,
      // Disable click on the row.
      renderCell: (params) => {
        if (params.value.relation === ClusterRelation.SAME) {
          return (
            <Tooltip title={"Thuộc cùng nhóm với bài nộp này"} placement='top'>
              <IconButton
                onClick={() => {
                  navigate(
                    routes.lecturer.exam.code_plagiarism_detection_clusters_detail.replace(
                      ":clusterId",
                      params.value.id
                    )
                  );
                }}
              >
                <TollTwoToneIcon />
              </IconButton>
            </Tooltip>
          );
        } else if (params.value.relation === ClusterRelation.DIFFERENT) {
          return (
            <Tooltip title={"Không thuộc cùng nhóm với bài nộp này"} placement='top'>
              <IconButton
                onClick={() => {
                  navigate(
                    routes.lecturer.exam.code_plagiarism_detection_clusters_detail.replace(
                      ":clusterId",
                      params.value.id
                    )
                  );
                }}
              >
                <TollIcon />
              </IconButton>
            </Tooltip>
          );
        }
        return <></>;
      }
    },
    {
      field: "actions",
      headerName: "So sánh",
      flex: 1,
      renderCell: (params) => {
        return (
          <Button
            btnType={BtnType.Text}
            onClick={() => {
              navigate(
                routes.lecturer.exam.code_plagiarism_detection_pairs_detail.replace(
                  ":pairId",
                  params.value.pairId
                )
              );
            }}
            endIcon={<ArrowForwardIosIcon />}
          >
            So sánh
          </Button>
        );
      }
    }
  ];

  if (report && report?.labels?.length > 0) {
    tableHeading.splice(2, 0, {
      field: "labels",
      headerName: "Nhãn",
      width: 70,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    });
  }

  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(
      routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
        ":submissionId",
        params.id.toString()
      )
    );
  };

  const xAxisData = React.useMemo(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  }, []);

  const yAxisData = React.useMemo(() => {
    const zeroArray = Array(xAxisData.length).fill(0);
    filterdFiles.forEach((file) => {
      for (let i = 0; i < xAxisData.length; i++) {
        const similarity = file.fileScoring?.similarityScore?.similarity || 0;
        if (similarity * 100 >= xAxisData[i] && similarity * 100 < xAxisData[i] + 5) {
          zeroArray[i] += 1;
        }
        if (xAxisData[i] === 95 && similarity * 100 === 100) {
          zeroArray[i] += 1;
        }
      }
    });

    return zeroArray;
  }, [xAxisData, filterdFiles]);

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
          marginTop: `${headerHeight}px`
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
                onClick={() => navigate(routes.lecturer.exam.code_plagiarism_detection)}
              >
                Tổng quan Kiểm tra gian lận
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Danh sách cặp bài nộp</ParagraphSmall>
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
              <Heading1>
                Bài nộp của {currentSubmissionFile?.extra.orgUserId} -{" "}
                {currentSubmissionFile?.extra.userFullName}
              </Heading1>
              <ParagraphBody>Thông tin liên quan đến bài nộp hiện tại.</ParagraphBody>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Card
                    sx={{
                      padding: "15px"
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading3>So sánh</Heading3>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>So sánh bài nộp này với các bài nộp khác</ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <FileSubmissionsCompareFeatureBar />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomDataGrid
                          dataList={dataList}
                          tableHeader={tableHeading}
                          onSelectData={rowSelectionHandler}
                          dataGridToolBar={dataGridToolbar}
                          page={page}
                          pageSize={pageSize}
                          totalElement={totalElement}
                          onPaginationModelChange={pageChangeHandler}
                          showVerticalCellBorder={true}
                          getRowHeight={() => "auto"}
                          onClickRow={rowClickHandler}
                          cellClickParamFields={["cluster", "actions"]}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                  <Card
                    sx={{
                      padding: "15px",
                      marginTop: "15px"
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading3>
                          Code của {currentSubmissionFile?.extra?.orgUserId ?? ""} -{" "}
                          {currentSubmissionFile?.extra?.userFullName ?? ""}
                        </Heading3>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>Xem code của bài nộp này.</ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <Card>
                          <CodeEditor
                            readOnly
                            value={currentSubmissionFile?.lines?.join("\n") || ""}
                          />
                        </Card>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      padding: "15px"
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading3>Thông tin bài nộp</Heading3>
                      </Grid>
                      <Grid item xs={12}>
                        <Tooltip title='Mã số sinh viên' placement='top'>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "fit-content"
                            }}
                          >
                            <AccountCircleIcon />
                            <ParagraphBody fontWeight={500}>
                              {currentSubmissionFile?.extra?.orgUserId}
                            </ParagraphBody>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12}>
                        <Tooltip title='Tên sinh viên' placement='top'>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "fit-content"
                            }}
                          >
                            <BadgeIcon />
                            <ParagraphBody fontWeight={500}>
                              {currentSubmissionFile?.extra?.userFullName}
                            </ParagraphBody>
                          </Box>
                        </Tooltip>
                      </Grid>
                      {report?.labels &&
                        report.labels.length > 0 &&
                        currentSubmissionFile?.extra?.labels &&
                        currentSubmissionFile?.extra.labels.length > 0 && (
                          <Grid item xs={12}>
                            <Tooltip title='Nhãn' placement='top'>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  width: "fit-content"
                                }}
                              >
                                <LocalOfferOutlinedIcon />
                                <ParagraphBody fontWeight={500}>
                                  {currentSubmissionFile?.extra.labels}
                                </ParagraphBody>
                              </Box>
                            </Tooltip>
                          </Grid>
                        )}
                      <Grid item xs={12}>
                        <Tooltip title='Ngày nộp bài' placement='top'>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "fit-content"
                            }}
                          >
                            <ScheduleIcon />
                            <ParagraphBody fontWeight={500}>
                              {new Date(
                                currentSubmissionFile?.extra?.createdAt || ""
                              ).toLocaleString()}
                            </ParagraphBody>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12}>
                        <Tooltip title='Ngôn ngữ lập trình' placement='top'>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "fit-content"
                            }}
                          >
                            <CodeOffIcon />
                            <ParagraphBody fontWeight={500}>
                              {report?.language.name || "Không xác định"}
                            </ParagraphBody>
                          </Box>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Card>
                  <Card
                    sx={{
                      padding: "15px",
                      marginTop: "15px"
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Heading3>Đồ thị tương đồng</Heading3>
                      </Grid>
                      <Grid item xs={12}>
                        <ParagraphBody>
                          Độ tương đồng cao nhất của bài nộp này (màu đỏ) so với độ tương đồng cao
                          nhất của các bài nộp khác.
                        </ParagraphBody>
                      </Grid>
                      <Grid item xs={12}>
                        <SimilarityHistogram
                          xAxisData={xAxisData}
                          y={yAxisData}
                          field={SimilarityHistogramField.SIMILARITY}
                          currentValue={
                            (currentSubmissionFile?.fileScoring?.similarityScore?.similarity || 0) *
                            100
                          }
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
