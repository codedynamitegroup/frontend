import { render } from "@fullcalendar/core/preact";
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  ModalClose,
  ModalDialog
} from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { Grid } from "@mui/material";
import {
  GridCallbackDetails,
  GridColDef,
  GridColumnVisibilityModel,
  GridEventListener,
  GridPaginationModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import ParagraphBody from "components/text/ParagraphBody";
import { GetAllQuestionWithPaginationResponse } from "models/courseService/entity/QuestionEntity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionService } from "services/coreService/QuestionService";

interface PropsData {
  open: boolean;
  onClose: () => void;
  onConfirm: (questionData: {
    questionId: string;
    name: string;
    difficulty: string;
    questionText: string;
  }) => void;
}

const CodeQuestionDialog = (props: PropsData) => {
  const { onClose, onConfirm, open } = props;
  const { t } = useTranslation();
  const [questionList, setQuestionList] = useState<GetAllQuestionWithPaginationResponse>({
    questions: [],
    totalPages: 0,
    currentPage: 0,
    totalItems: 0
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const visibleColumn: GridColumnVisibilityModel = useMemo(() => {
    return {
      id: false,
      name: true,
      difficulty: true,
      questionText: true
    };
  }, []);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetQuestionList = useCallback(
    async ({
      searchName,
      pageNo = 0,
      pageSize = 10,
      qtype = "CODE"
    }: {
      searchName?: string;
      pageNo?: number;
      pageSize?: number;
      qtype?: string;
    }) => {
      try {
        const response = await QuestionService.getAllQuestionWithPagination({
          searchName,
          pageNo,
          pageSize,
          qtype
        });
        setQuestionList(response);
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          // dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // dispatch(setLoading(false));
      }
    },
    [t]
  );

  useEffect(() => {
    const fetchData = async () => {
      handleGetQuestionList({
        searchName: searchValue
      });
      setLoading(false);
    };
    fetchData();
  }, [handleGetQuestionList, searchValue]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const tableHeading: GridColDef[] = useMemo(
    () => [
      {
        field: "id"
      },
      {
        field: "name",
        headerName: t("common_name"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("common_name")}
            </ParagraphBody>
          );
        },
        renderCell: (params) => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"400"}>
              {params.row.name}
            </ParagraphBody>
          );
        }
      },
      {
        field: "difficulty",
        headerName: t("question_difficulty"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("common_name")}
            </ParagraphBody>
          );
        },
        renderCell: (params) => {
          return <Chip>{params.row.difficulty}</Chip>;
        }
      },
      {
        field: "questionText",
        headerName: t("common_question_text"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("common_question_text")}
            </ParagraphBody>
          );
        },
        renderCell: (params) => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"400"}>
              {params.row.questionText}
            </ParagraphBody>
          );
        }
      }
    ],
    []
  );
  const totalElement = useMemo(() => questionList.totalItems || 0, [questionList]);
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetQuestionList({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  useEffect(() => {
    console.log("questionList", questionList);
  }, [questionList]);

  const handleEvent: GridEventListener<"rowClick"> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details // GridCallbackDetails
  ) => {
    onConfirm(params.row);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        color='neutral'
        layout='center'
        size='lg'
        variant='outlined'
        sx={{
          width: "50%",
          backgroundColor: "white"
        }}
      >
        <ModalClose />
        <DialogTitle>
          <ParagraphBody>{t("choose_code_question")}</ParagraphBody>
        </DialogTitle>
        <DialogContent
          sx={{
            width: "100%"
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomDataGrid
                onClickRow={handleEvent}
                loading={loading}
                visibleColumn={visibleColumn}
                getRowId={(params) => params.questionId}
                dataList={questionList.questions}
                tableHeader={tableHeading}
                onSelectData={() => {}}
                dataGridToolBar={{ enableToolbar: true }}
                page={page}
                pageSize={pageSize}
                totalElement={totalElement}
                onPaginationModelChange={pageChangeHandler}
                showVerticalCellBorder={false}
                getRowHeight={() => "50"}
                // onClickRow={rowClickHandler}
                sx={{
                  "&.MuiDataGrid-withBorderColor": {
                    border: "1px solid white"
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "white",
                    borderBottom: "2px solid var(--gray-50)"
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    backgroundColor: "#f5f9fb"
                  },
                  width: "100%",
                  minHeight: "500px"
                }}
                personalSx={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='soft' color='danger' onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default CodeQuestionDialog;
