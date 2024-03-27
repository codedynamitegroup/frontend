import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, CssBaseline, Grid, IconButton, Tab, Tabs, Toolbar } from "@mui/material";
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
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import { RootState } from "store";
import CircularProgressWithLabel from "../SourceCodePlagiarismOverview/components/FilePairsTable/components/CircularProgressWithLabel";
import ClustersFeatureBar from "./components/FeatureBar";
import classes from "./styles.module.scss";

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

export default function LecturerSourceCodePlagiarismClustersDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = React.useState(0);
  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const { report, filterdFiles, filteredPairs } = codePlagiarismState;

  const dataSubmissionList = React.useMemo(() => {
    if (filterdFiles.length === 0) return [];
    const result = filterdFiles.map((file, index) => {
      return {
        id: file.id.toString(),
        userId: file.extra.userId,
        orgUserId: file.extra.orgUserId,
        userFullName: file.extra.userFullName,
        labels: file.extra.labels,
        questionName: file.extra.questionName,
        examName: file.extra.examName,
        createdAt: file.extra.createdAt,
        highestSimilarity: file?.fileScoring?.similarityScore?.similarity || 0,
        lines: file?.lineCount || 0
      };
    });
    // sort by highest similarity
    return result.sort((a, b) => b.highestSimilarity - a.highestSimilarity);
  }, [filterdFiles]);

  const submissionListTableHeading: GridColDef[] = [
    {
      field: "orgUserId",
      headerName: "MSSV",
      width: 120,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "userFullName",
      headerName: "Tên sinh viên",
      flex: 1,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "examName",
      headerName: "Bài kiểm tra",
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
      field: "highestSimilarity",
      headerName: "Độ tương đồng cao nhất",
      flex: 1,
      renderCell: (params) => {
        return <CircularProgressWithLabel value={Number(params.value) * 100 || 0} />;
      }
    },
    {
      field: "lines",
      headerName: "Số dòng",
      flex: 1,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    }
  ];

  if (report && report?.labels?.length > 0) {
    submissionListTableHeading.splice(2, 0, {
      field: "labels",
      headerName: "Nhãn",
      width: 150,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    });
  }

  const dataPairList = React.useMemo(() => {
    const result = filteredPairs.map((pair, index) => {
      return {
        id: pair.id,
        leftFile: pair.leftFile,
        rightFile: pair.rightFile,
        similarity: pair.similarity,
        longestFragment: pair.longestFragment,
        totalOverlap: pair.totalOverlap
      };
    });
    // sort by similarity
    return result.sort((a, b) => b.similarity - a.similarity);
  }, [filteredPairs]);

  const pairListTableHeading: GridColDef[] = [
    {
      field: "leftFile",
      headerName: "Mã số sinh viên trái",
      flex: 1,
      renderCell: (params) => {
        return (
          <ParagraphBody>
            {params.value?.extra?.orgUserId || t("code_plagiarism_not_updated")}
          </ParagraphBody>
        );
      }
    },
    {
      field: "rightFile",
      headerName: "Mã số sinh viên phải",
      flex: 1,
      renderCell: (params) => {
        return (
          <ParagraphBody>
            {params.value?.extra?.orgUserId || t("code_plagiarism_not_updated")}
          </ParagraphBody>
        );
      }
    },
    {
      field: "similarity",
      headerName: t("code_plagiarism_highest_similarity_title"),
      flex: 1,
      renderCell: (params) => {
        return <CircularProgressWithLabel value={Number(params.value) * 100 || 0} />;
      }
    },
    { field: "longestFragment", headerName: t("code_plagiarism_longest_fragment_title"), flex: 1 },
    { field: "totalOverlap", headerName: t("code_plagiarism_total_overlap_title"), flex: 1 }
  ];

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
  const pageSize = 15;
  const totalElement = tabIndex === 0 ? dataSubmissionList.length : dataPairList.length;

  const rowClickHandler = (params: GridRowParams<any>) => {
    const navigatePath =
      tabIndex === 0
        ? routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
            ":submissionId",
            params.row.id
          )
        : routes.lecturer.exam.code_plagiarism_detection_pairs_detail.replace(
            ":pairId",
            params.row.id
          );
    navigate(navigatePath);
  };

  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

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
                onClick={() =>
                  navigate(routes.lecturer.exam.code_plagiarism_detection, {
                    state: { report }
                  })
                }
              >
                Tổng quan Kiểm tra gian lận
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() => navigate(routes.lecturer.exam.code_plagiarism_detection_clusters)}
              >
                Danh sách chia nhóm
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall colorname='--blue-500'>Chi tiết nhóm bài nộp</ParagraphSmall>
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
              <Heading1 translation-key='code_plagiarism_file_pairs_list_title'>Nhóm 1</Heading1>
              <ParagraphBody>
                {/* Relevant information about the current cluster. */}
                Thông tin liên quan đến nhóm hiện tại.
              </ParagraphBody>
              <Card
                sx={{
                  padding: "15px"
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <ClustersFeatureBar />
                  </Grid>
                  <Grid item xs={12}>
                    <Tabs value={tabIndex} onChange={handleChangeTabIndex} aria-label='tabIndex'>
                      <Tab iconPosition='start' label={"Danh sách bài nộp"} />
                      <Tab iconPosition='start' label={"Danh sách cặp bài nộp"} />
                    </Tabs>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomDataGrid
                      dataList={tabIndex === 0 ? dataSubmissionList : dataPairList}
                      tableHeader={
                        tabIndex === 0 ? submissionListTableHeading : pairListTableHeading
                      }
                      onSelectData={rowSelectionHandler}
                      dataGridToolBar={dataGridToolbar}
                      page={page}
                      pageSize={pageSize}
                      totalElement={totalElement}
                      onPaginationModelChange={pageChangeHandler}
                      showVerticalCellBorder={true}
                      getRowHeight={() => "auto"}
                      onClickRow={rowClickHandler}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
