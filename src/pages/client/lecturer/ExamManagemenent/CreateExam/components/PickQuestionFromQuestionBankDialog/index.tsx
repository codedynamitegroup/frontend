import { TabPanel } from "@mui/lab";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { GridRowParams } from "@mui/x-data-grid";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomDialog from "components/common/dialogs/CustomDialog";
import BasicSelect from "components/common/select/BasicSelect";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { QuestionClone, QuestionEntity } from "models/coreService/entity/QuestionEntity";
import { QuestionTypeEnum } from "models/coreService/enum/QuestionTypeEnum";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess } from "reduxes/AppStatus";
import { QuestionService } from "services/coreService/QuestionService";

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
  const [category, setCategory] = React.useState(categoryList?.[0]?.value || "");
  const [activeTab, setActiveTab] = React.useState("0");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const questionCategoryState = useSelector((state: RootState) => state.questionCategory);
  const [basicTypesQuestions, setBasicTypesQuestions] = React.useState<{
    questions: QuestionEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }>({
    questions: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  });

  const [codeTypeQuestions, setCodeTypeQuestions] = React.useState<{
    questions: QuestionEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  }>({
    questions: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  });

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
    [t]
  );

  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGetQuestions = async ({
    categoryId,
    search = searchText,
    pageNo = 0,
    pageSize = 99,
    isBasicType = true
  }: {
    categoryId: string;
    search?: string;
    pageNo?: number;
    pageSize?: number;
    isBasicType?: boolean;
  }) => {
    try {
      setLoading(true);
      const getQuestionResponse = await QuestionService.getQuestionsByCategoryId({
        categoryId,
        search,
        pageNo,
        pageSize,
        isBasicType
      });
      if (isBasicType) {
        setBasicTypesQuestions({
          questions: getQuestionResponse.questionResponses || [],
          currentPage: getQuestionResponse.currentPage || 0,
          totalItems: getQuestionResponse.totalItems || 0,
          totalPages: getQuestionResponse.totalPages || 0
        });
      } else {
        setCodeTypeQuestions({
          questions: getQuestionResponse.questionResponses || [],
          currentPage: getQuestionResponse.currentPage || 0,
          totalItems: getQuestionResponse.totalItems || 0,
          totalPages: getQuestionResponse.totalPages || 0
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch questions by category id", error);
      setLoading(false);
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
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetQuestions({
      categoryId: category,
      pageNo: model.page,
      pageSize: model.pageSize,
      isBasicType: true
    });
  };

  const codeTypeQuesPageChangeHandler = (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetQuestions({
      categoryId: category,
      pageNo: model.page,
      pageSize: model.pageSize,
      isBasicType: false
    });
  };
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    handleGetQuestions({ categoryId: value });
  };

  React.useEffect(() => {
    if (activeTab === "0") {
      setPage(0);
      setSelectedRowId([]);
      handleGetQuestions({
        categoryId: category,
        search: searchText,
        pageNo: page,
        pageSize: pageSize,
        isBasicType: true
      });
    } else {
      setPage(0);
      setSelectedRowId([]);
      handleGetQuestions({
        categoryId: category,
        search: searchText,
        pageNo: page,
        pageSize: pageSize,
        isBasicType: false
      });
    }
  }, [category, activeTab]);

  const handleConfirm = () => {
    if (selectedRowId.length === 0) {
      dispatch(setErrorMess("Please select at least one question"));
      return;
    } else if (activeTab === "1") {
      navigate(`lecturer/questions/code/create/${selectedRowId[0].questionId}`, {
        state: {
          categoryName: categoryList?.find((item) => item.value === category)?.label
        }
      });
    } else if (activeTab === "0") {
      onHanldeConfirm && onHanldeConfirm(selectedRowId);
    }
  };

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      onHandleCancel={onHandleCancel}
      // onHanldeConfirm={onHanldeConfirm ? () => onHanldeConfirm(selectedRowId) : () => {}}
      onHanldeConfirm={handleConfirm}
      minWidth='1000px'
      {...props}
    >
      <Grid container spacing={0} columns={12} marginBottom={"10px"}>
        <Heading5 translate-key='exam_management_create_question_note'>Note:</Heading5>
        <ReactQuill
          value={`<p>With <strong>Basic Types Questions</strong> such as <strong>Short Answer</strong>, <strong>Multiple Choice</strong>, <strong>Essay</strong>, and <strong>True/False</strong>, you can select and create multiple questions simultaneously.<br><br></p><p>However, for the <strong>Code Type Questions</strong>, you can only select and create one question at a time.</p>`}
          readOnly={true}
          theme={"bubble"}
        />
      </Grid>
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
              marginTop: "0px",
              marginBottom: "15px"
            }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          borderRadius: "5px",
          border: "1px solid #e0e0e0"
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          aria-label='basic tabs example'
          // className={classes.tabs}
          variant='fullWidth'
        >
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translate-key='common_details'>Basic Types Questions</ParagraphBody>
            }
            value={"0"}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label={
              <ParagraphBody translate-key='common_problems'>Code Type Questions</ParagraphBody>
            }
            value={"1"}
          />
        </Tabs>
      </Box>
      {activeTab === "0" && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomDataGrid
              loading={loading}
              dataList={basicTypesQuestions.questions.map((question, index) => ({
                stt: page * pageSize + index + 1,
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
              totalElement={basicTypesQuestions.totalItems}
              onPaginationModelChange={pageChangeHandler}
              showVerticalCellBorder={false}
              checkboxSelection
              // onClickRow={rowClickHandler}
            />
          </Grid>
        </Grid>
      )}
      {activeTab === "1" && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomDataGrid
              loading={loading}
              dataList={codeTypeQuestions.questions.map((question, index) => ({
                stt: page * pageSize + index + 1,
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
              totalElement={codeTypeQuestions.totalItems}
              onPaginationModelChange={codeTypeQuesPageChangeHandler}
              showVerticalCellBorder={false}
              disableRowSelectionOnClick={false}
              // onClickRow={rowClickHandler}
            />
          </Grid>
        </Grid>
      )}
    </CustomDialog>
  );
}
