import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, CssBaseline, Grid, IconButton, Toolbar } from "@mui/material";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFileWithFileScoring } from "reduxes/CodePlagiarism";
import { routes } from "routes/routes";
import { RootState } from "store";
import CircularProgressWithLabel from "../SourceCodePlagiarismOverview/components/FilePairsTable/components/CircularProgressWithLabel";
import FileSubmissionsFeatureBar from "./components/FeatureBar";
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

export default function LecturerSourceCodePlagiarismFileSubmissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startSimilarity = searchParams.get("startSimilarity") || "0";
  const endSimilarity = searchParams.get("endSimilarity") || "1";
  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const { report, filterdFiles, filteredPairs } = codePlagiarismState;

  const dataList = React.useMemo(() => {
    if (filterdFiles.length === 0) return [];
    const newFilteredFilesByStartAndEndSimilarity = filterdFiles.filter((file) => {
      const newFile = getFileWithFileScoring(file, filteredPairs);
      const similarity = newFile?.fileScoring?.similarityScore?.similarity || 0;
      return similarity >= Number(startSimilarity) && similarity <= Number(endSimilarity);
    });
    const result = newFilteredFilesByStartAndEndSimilarity.map((file, index) => {
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
  }, [filterdFiles, filteredPairs, startSimilarity, endSimilarity]);

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 20;
  const totalElement = dataList.length;

  const tableHeading: GridColDef[] = [
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
    tableHeading.splice(2, 0, {
      field: "labels",
      headerName: "Nhãn",
      width: 150,
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    });
  }

  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(
      routes.lecturer.exam.code_plagiarism_detection_submissions_detail.replace(
        ":submissionId",
        params.row.id.toString()
      )
    );
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
                onClick={() => navigate(routes.lecturer.exam.submissions)}
              >
                Danh sách bài nộp
              </ParagraphSmall>
              <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
              <ParagraphSmall
                colorname='--blue-500'
                className={classes.cursorPointer}
                onClick={() =>
                  navigate(routes.lecturer.exam.code_plagiarism_detection, {
                    state: { report: report }
                  })
                }
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
              <Heading1>Danh sách bài nộp</Heading1>
              <ParagraphBody>
                Tất cả bài nộp đã được phân tích với độ tương đồng cao nhất.
              </ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FileSubmissionsFeatureBar />
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
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Main>
      </Box>
    </Grid>
  );
}
