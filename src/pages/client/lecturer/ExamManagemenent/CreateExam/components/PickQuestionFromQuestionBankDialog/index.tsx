import { Grid } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicSelect from "components/common/select/BasicSelect";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import * as React from "react";
import QuestionsFeatureBar from "../FeatureBar";
import { GridRowParams } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { QuestionService } from "services/coreService/QuestionService";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionsCategory } from "reduxes/coreService/questionCategory";
import { QuestionClone, QuestionCloneRequest } from "models/coreService/entity/QuestionEntity";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";
import { RootState } from "store";

interface PickQuestionFromQuestionBankDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: (questionIds: QuestionClone[]) => void;
  categoryPickTitle?: string;
  categoryList?: {
    value: string;
    label: string;
  }[];
  onQuestionPick?: () => void;
}

export default function PickQuestionFromQuestionBankDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  categoryPickTitle,
  categoryList,
  onQuestionPick,
  ...props
}: PickQuestionFromQuestionBankDialogProps) {
  const { t } = useTranslation();
  const [category, setCategory] = React.useState("0");

  const questionCategoryState = useSelector((state: RootState) => state.questionCategory);

  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      { field: "stt", headerName: "STT", minWidth: 1 },
      {
        field: "name",
        headerName: t("exam_management_create_question_name"),
        minWidth: 250
      },
      {
        field: "questionText",
        headerName: t("exam_management_create_question_description"),
        minWidth: 400,
        renderCell: (params) => <div dangerouslySetInnerHTML={{ __html: params.value }}></div>
      },
      {
        field: "qtypeText",
        headerName: t("exam_management_create_question_type"),
        minWidth: 150
      }
    ],
    []
  );

  const [searchText, setSearchText] = React.useState("");
  const dispatch = useDispatch();
  const handleGetQuestions = async ({
    categoryId,
    search = searchText,
    pageNo = 0,
    pageSize = 99
  }: {
    categoryId: string;
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      const getQuestionResponse = await QuestionService.getQuestionsByCategoryId({
        categoryId,
        search,
        pageNo,
        pageSize
      });
      dispatch(setQuestionsCategory(getQuestionResponse));
    } catch (error) {
      console.error("Failed to fetch questions by category id", error);
    }
  };

  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };

  const [selectedRowId, setSelectedRowId] = React.useState<QuestionClone[]>([]);

  const rowSelectionHandler = async (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    const questionIds: QuestionClone[] = selectedRowId.map((id) => ({
      questionId: id.toString()
    }));
    setSelectedRowId(questionIds);
  };

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    handleGetQuestions({ categoryId: value });
  };

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm ? () => onHanldeConfirm(selectedRowId) : () => {}}
      minWidth='1000px'
      {...props}
    >
      <Grid container spacing={1} columns={12}>
        <Grid item xs={3}>
          <TextTitle>{categoryPickTitle || ""}</TextTitle>
        </Grid>
        <Grid item xs={9}>
          <BasicSelect
            labelId='category-label'
            value={category}
            onHandleChange={handleCategoryChange}
            items={categoryList}
            backgroundColor='white'
            style={{
              marginTop: "0px"
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <QuestionsFeatureBar
            colSearchLabel='Tìm kiếm theo cột'
            colItems={[
              { label: "Tên câu hỏi", value: "name" },
              { label: "Kiểu", value: "type" }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            dataList={questionCategoryState.questions.map((question, index) => ({
              stt: index + 1,
              qtypeText:
                question.qtype === QuestionTypeEnum.SHORT_ANSWER
                  ? "câu hỏi ngắn"
                  : question.qtype === QuestionTypeEnum.MULTIPLE_CHOICE
                    ? "câu hỏi trắc nghiệm"
                    : question.qtype === QuestionTypeEnum.ESSAY
                      ? "câu hỏi tự luận"
                      : question.qtype === QuestionTypeEnum.TRUE_FALSE
                        ? "câu hỏi đúng/sai"
                        : question.qtype === QuestionTypeEnum.CODE
                          ? "câu hỏi code"
                          : "",
              ...question
            }))}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            visibleColumn={visibleColumnList}
            dataGridToolBar={dataGridToolbar}
            page={page}
            pageSize={pageSize}
            totalElement={totalElement}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={false}
            checkboxSelection
            onClickRow={rowClickHandler}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
