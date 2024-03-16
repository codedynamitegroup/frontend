import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Card, CssBaseline, Grid, IconButton, Toolbar } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Header from "components/Header";
import Heading1 from "components/text/Heading1";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import useBoxDimensions from "hooks/useBoxDimensions";
import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import CustomDataGrid from "components/common/CustomDataGrid";
import FilePairsFeatureBar from "./components/FeatureBar";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CircularProgressWithLabel from "../SourceCodePlagiarismOverview/components/FilePairsTable/components/CircularProgressWithLabel";
import { DolosCustomFile } from "../SourceCodePlagiarismOverview";
import { useTranslation } from "react-i18next";

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

export default function LecturerSourceCodePlagiarismSubmissions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId") || "0";

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
  const pageSize = 5;
  const totalElement = 100;

  const location = useLocation();
  const [data, setData] = React.useState<{
    pairs: {
      id: string;
      leftFile: DolosCustomFile;
      rightFile: DolosCustomFile;
      leftCovered: number;
      rightCovered: number;
      leftTotal: number;
      rightTotal: number;
      longestFragment: number;
      highestSimilarity: number;
      totalOverlap: number;
      buildFragments: {
        left: {
          startRow: number;
          startCol: number;
          endRow: number;
          endCol: number;
        };
        right: {
          startRow: number;
          startCol: number;
          endRow: number;
          endCol: number;
        };
      }[];
    }[];
  }>({ pairs: location.state?.pairs || [] });

  const tableHeading: GridColDef[] = [
    {
      field: "leftFile",
      headerName: t("code_plagiarism_left_file_title"),
      flex: 1,
      renderCell: (params) => {
        return (
          <ParagraphBody>
            {params.value?.extra?.filename || t("code_plagiarism_not_updated")}
          </ParagraphBody>
        );
      }
    },
    {
      field: "rightFile",
      headerName: t("code_plagiarism_right_file_title"),
      flex: 1,

      renderCell: (params) => {
        return (
          <ParagraphBody>
            {params.value?.extra?.filename || t("code_plagiarism_not_updated")}
          </ParagraphBody>
        );
      }
    },
    {
      field: "highestSimilarity",
      headerName: t("code_plagiarism_highest_similarity_title"),
      flex: 1,
      renderCell: (params) => {
        return <CircularProgressWithLabel value={Number(params.value) * 100 || 0} />;
      }
    },
    { field: "longestFragment", headerName: t("code_plagiarism_longest_fragment_title"), flex: 1 },
    { field: "totalOverlap", headerName: t("code_plagiarism_total_overlap_title"), flex: 1 }
  ];

  const rowClickHandler = (params: GridRowParams<any>) => {
    navigate(
      routes.lecturer.exam.code_plagiarism_detection_file_pairs_detail +
        `?questionId=${questionId}`,
      {
        state: {
          data: params.row
        }
      }
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
          marginTop: `${headerHeight + 20}px`
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
                {t("code_plagiarism_file_pairs_list_title")}
              </Heading1>
              <Heading3>Câu hỏi code 1 - Bài kiểm tra cuối kỳ</Heading3>
              <ParagraphBody translation-key='code_plagiarism_file_pairs_list_description'>
                {t("code_plagiarism_file_pairs_list_description")}
              </ParagraphBody>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FilePairsFeatureBar />
                </Grid>
                <Grid item xs={12}>
                  <CustomDataGrid
                    dataList={data.pairs || []}
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
