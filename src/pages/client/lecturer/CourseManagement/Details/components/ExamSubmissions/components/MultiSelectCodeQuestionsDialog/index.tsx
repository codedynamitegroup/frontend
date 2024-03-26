import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryIcon from "@mui/icons-material/History";
import { Grid, Tab, Tabs } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import { GridRowParams } from "@mui/x-data-grid";
import { GridCallbackDetails } from "@mui/x-data-grid/models/api/gridCallbackDetails";
import { GridColDef } from "@mui/x-data-grid/models/colDef";
import { GridPaginationModel } from "@mui/x-data-grid/models/gridPaginationProps";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import CustomDataGrid from "components/common/CustomDataGrid";
import BasicAccordion from "components/common/accordion/BasicAccordion";
import CustomDialog from "components/common/dialogs/CustomDialog";
import Heading3 from "components/text/Heading3";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import * as React from "react";
import { useTranslation } from "react-i18next";
import CodeQuestionsFeatureBar from "./components/CodeQuestionsFeatureBar";
import useWindowDimensions from "hooks/useWindowDimensions";

interface MultiSelectCodeQuestionsDialogProps extends DialogProps {
  title?: string;
  handleClose: () => void;
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onHandleCancel?: () => void;
  onHanldeConfirm?: () => void;
  isConfirmLoading?: boolean;
}

export default function MultiSelectCodeQuestionsDialog({
  open,
  title,
  handleClose,
  children,
  cancelText,
  confirmText,
  onHandleCancel,
  onHanldeConfirm,
  isConfirmLoading = false,
  ...props
}: MultiSelectCodeQuestionsDialogProps) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = React.useState(0);
  const questionList = [
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d504",
      title: "Tính tổng từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d488",
      course_name: "CS101 - Lập trình căn bản",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d505",
      title: "Tỉnh tổng các số chẵn từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d488",
      course_name: "CS101 - Lập trình căn bản",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d506",
      title: "Tính tổng các số lẻ từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      exam_name: "Bài kiểm tra giữa kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d488",
      course_name: "CS101 - Lập trình căn bản",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d507",
      title: "Tính tổng các số nguyên tố từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      exam_name: "Bài kiểm tra hàng tuần 1",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      course_name: "CS102 - Lập trình hướng đối tượng",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d508",
      title: "Tính tổng các số chính phương từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      exam_name: "Bài kiểm tra hàng tuần 2",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      course_name: "CS102 - Lập trình hướng đối tượng",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d509",
      title: "Tính tổng các số hoàn thiện từ 1 đến n",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      exam_name: "Bài kiểm tra 1 tiết",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d489",
      course_name: "CS102 - Lập trình hướng đối tượng",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d510",
      title: "Thuật toán sắp xếp nổi bọt",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d491",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      course_name: "CS103 - Cấu trúc dữ liệu và giải thuật",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d511",
      title: "Thuật toán sắp xếp chọn",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d491",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      course_name: "CS103 - Cấu trúc dữ liệu và giải thuật",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d512",
      title: "Thuật toán sắp xếp chèn",
      exam_id: "f47ac10b-58cc-4372-a567-0e02b2c3d491",
      exam_name: "Bài kiểm tra cuối kỳ",
      course_id: "f47ac10b-58cc-4372-a567-0e02b2c3d490",
      course_name: "CS103 - Cấu trúc dữ liệu và giải thuật",
      user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
      created_at: "2024-03-24T07:19:47.000Z",
      updated_at: "2024-03-24T07:19:47.000Z"
    }
  ];

  const tableHeading: GridColDef[] = React.useMemo(
    () => [
      {
        field: "title",
        headerName: t("exam_management_create_question_name"),
        flex: 1
      },
      {
        field: "exam_name",
        headerName: "Bài kiểm tra",
        flex: 1
      },
      {
        field: "course_name",
        headerName: "Khóa học",
        flex: 1
      },
      {
        field: "created_at",
        headerName: "Ngày tạo",
        flex: 1,
        renderCell: (params) => <span>{new Date(params.value).toLocaleString()}</span>
      }
    ],
    []
  );

  const reportHistoryList = [
    {
      id: "43a17420-868f-49e5-bdb3-4f0766d5fb4b",
      comparedCodeQuestions: [
        {
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d495",
          title: "Tìm số lớn nhất trong mảng",
          exam_name: "Bài thi cuối kỳ",
          course_name: "CSC101 - Lập trình căn bản"
        },
        {
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d496",
          title: "Tìm số nhỏ nhất trong mảng",
          exam_name: "Bài thi giữa kỳ",
          course_name: "CSC102 - Lập trình hướng đối tượng"
        },
        {
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d497",
          title: "Tìm giá trị lớn thứ 2 trong mảng",
          exam_name: "Bài thi giữa kỳ",
          course_name: "CSC103 - Cấu trúc dữ liệu và giải thuật"
        }
      ],
      language: {
        name: "python",
        extensions: [".py", ".py3"]
      },
      createdAt: "2024-03-24T07:53:10.000Z",
      name: "Báo cáo gian lận tạo bởi Nguyễn Đinh Quang Khánh"
    }
  ];

  const reportHistoryTableHeading: GridColDef[] = React.useMemo(
    () =>
      [
        {
          field: "name",
          headerName: "Tên báo cáo",
          minWidth: 300
        },
        {
          field: "comparedCodeQuestions",
          headerName: "Các câu hỏi đã so sánh",
          minWidth: 450,
          renderCell: (params) => {
            return (
              <BasicAccordion title={"Danh sách câu hỏi"}>
                <Grid container spacing={2}>
                  {params.value.map((item: any) => (
                    <Grid item xs={12}>
                      <ParagraphBody>
                        {item.title} - {item.exam_name} - {item.course_name}
                      </ParagraphBody>
                    </Grid>
                  ))}
                </Grid>
              </BasicAccordion>
            );
          }
        },
        {
          field: "createdAt",
          headerName: "Ngày tạo",
          flex: 1,
          renderCell: (params) => <span>{new Date(params.value).toLocaleString()}</span>
        }
      ] as GridColDef[],
    []
  );

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
  const questionListtotalElement = questionList.length;
  const reportHistoryListTotalElement = reportHistoryList.length;

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleChangeTabIndex = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { height } = useWindowDimensions();

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      title={title}
      cancelText={cancelText}
      confirmText={confirmText}
      isConfirmLoading={isConfirmLoading}
      onHandleCancel={onHandleCancel}
      onHanldeConfirm={onHanldeConfirm}
      minWidth='1000px'
      maxHeight={`${0.8 * height}px`}
      {...props}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs
            value={tabIndex}
            onChange={handleChangeTabIndex}
            aria-label='tabIndex'
            variant='fullWidth'
            sx={{
              border: "1px solid #e0e0e0"
            }}
          >
            <Tab
              icon={<ChecklistIcon />}
              iconPosition='start'
              label={"Danh sách so sánh câu hỏi lập trình"}
            />
            <Tab icon={<HistoryIcon />} iconPosition='start' label={"Lịch sử báo cáo gian lận"} />
          </Tabs>
        </Grid>
        {tabIndex === 0 ? (
          <>
            <Grid item xs={12}>
              <CodeQuestionsFeatureBar />
            </Grid>
            <Grid item xs={12}>
              <Heading5
                fontStyle={"italic"}
                fontWeight={"400"}
                colorname='--gray-50'
                translation-key='code_management_detail_info_description'
              >
                Đánh dấu các câu hỏi lập trình bạn muốn tạo báo cáo gian lận cho danh sách bài nộp
                của sinh viên
              </Heading5>
            </Grid>
            <Grid item xs={12}>
              <CustomDataGrid
                dataList={questionList}
                tableHeader={tableHeading}
                onSelectData={rowSelectionHandler}
                dataGridToolBar={dataGridToolbar}
                page={page}
                pageSize={pageSize}
                totalElement={questionListtotalElement}
                onPaginationModelChange={pageChangeHandler}
                showVerticalCellBorder={false}
                checkboxSelection
                getRowHeight={() => "auto"}
                onClickRow={rowClickHandler}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12}>
              <Heading3>Lịch sử báo cáo gian lận</Heading3>
            </Grid>
            <Grid item xs={12}>
              <CodeQuestionsFeatureBar />
            </Grid>
            <Grid item xs={12}>
              <CustomDataGrid
                dataList={reportHistoryList}
                tableHeader={reportHistoryTableHeading}
                onSelectData={rowSelectionHandler}
                dataGridToolBar={dataGridToolbar}
                page={page}
                pageSize={pageSize}
                totalElement={reportHistoryListTotalElement}
                onPaginationModelChange={pageChangeHandler}
                showVerticalCellBorder={false}
                getRowHeight={() => "auto"}
                onClickRow={rowClickHandler}
              />
            </Grid>
          </>
        )}
      </Grid>
    </CustomDialog>
  );
}
