import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, Chip, CssBaseline, Grid, IconButton, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import ClustersDetailsFeatureBar from "./components/FeatureBar";
import classes from "./styles.module.scss";

import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store";
import CircularProgressWithLabel from "../SourceCodePlagiarismOverview/components/FilePairsTable/components/CircularProgressWithLabel";
import { File } from "models/codePlagiarism";

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

export default function LecturerSourceCodePlagiarismClusters() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const codePlagiarismState = useSelector((state: RootState) => state.codePlagiarism);
  const { clusters } = codePlagiarismState;

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
  const totalElement = clusters.length;

  const dataList = React.useMemo(() => {
    return clusters.map((cluster, index) => {
      return {
        id: cluster.id,
        no: index + 1,
        submissions: cluster.submissions,
        averageSimilarity: cluster.similarity,
        size: cluster.size
      };
    });
  }, [clusters]);

  const tableHeading: GridColDef[] = [
    {
      field: "no",
      headerName: "Nhóm",
      width: 70,
      align: "center",
      renderCell: (params) => {
        return <ParagraphBody>{params.value || t("code_plagiarism_not_updated")}</ParagraphBody>;
      }
    },
    {
      field: "submissions",
      headerName: "Bài nộp",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto"
            }}
          >
            {params.value?.map((submission: File, submissionIndex: number) => {
              return (
                <Tooltip
                  key={submissionIndex}
                  title={`${submission.id} - ${submission.extra.studentId} - ${submission.extra.studentName}`}
                  placement={"top"}
                >
                  <Chip
                    label={`${submission.extra.studentId}`}
                    sx={{
                      margin: "5px"
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        );
      }
    },
    {
      field: "averageSimilarity",
      headerName: "Độ tương đồng trung bình",
      width: 250,
      renderCell: (params) => {
        return <CircularProgressWithLabel value={Number(params.value) * 100 || 0} />;
      }
    },
    {
      field: "size",
      headerName: "Kích thước",
      width: 150,
      renderCell: (params) => {
        return <ParagraphBody>{params.value} bài nộp</ParagraphBody>;
      }
    }
  ];

  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(
      routes.lecturer.exam.code_plagiarism_detection_clusters_detail.replace(
        ":clusterId",
        params.row.id
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
              <Heading1 translation-key='code_plagiarism_file_pairs_list_title'>
                Danh sách chia nhóm
              </Heading1>
              <ParagraphBody>Tất cả các nhóm, được hình thành bởi ngưỡng tương đồng</ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ClustersDetailsFeatureBar />
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
