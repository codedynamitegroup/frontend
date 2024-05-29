import { Box, Grid, Link } from "@mui/material";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading1 from "components/text/Heading1";
import { useTranslation } from "react-i18next";
import ContestManagementFeatureBar from "./components/FeatureBar";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ParagraphBody from "components/text/ParagraphBody";
import { ContestService } from "services/coreService/ContestService";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import { useEffect } from "react";

interface ContestManagementProps extends ContestEntity {
  id: string;
}

const ContestManagement = () => {
  const { t } = useTranslation();
  const tableHeading: GridColDef[] = [
    {
      field: "name",
      headerName: t("common_name"),
      flex: 1
    },
    {
      field: "description",
      headerName: t("common_description"),
      flex: 1
    },
    {
      field: "createdBy",
      headerName: t("common_created_by"),
      flex: 1,
      renderCell: (params) => {
        return <Link>{`${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`}</Link>;
      }
    },
    { field: "startTime", headerName: t("common_start_time"), flex: 1 },
    { field: "endTime", headerName: t("common_end_time"), flex: 1 },
    {
      field: "numOfParticipants",
      headerName: t("common_num_of_participants"),
      flex: 1
    },
    {
      field: "action",
      headerName: t("common_action"),
      type: "actions",
      flex: 1,
      getActions: (params) => {
        console.log("field action params", params);
        return [
          <GridActionsCellItem icon={<EditIcon />} label='Edit' />,
          <GridActionsCellItem icon={<DeleteIcon />} label='Delete' />
        ];
      }
    }
  ];

  const page = 0;
  const pageSize = 5;
  const totalElement = 100;

  const contestList: ContestManagementProps[] = [
    {
      id: "1",
      contestId: "1",
      name: "Contest 1",
      description: "Description 1",
      thumbnailUrl: "",
      startTime: "2021-10-10",
      endTime: "2021-10-20",
      questions: [],
      numOfParticipants: 100,
      createdBy: {
        userId: "1",
        firstName: "Quang",
        lastName: "Khanh"
      },
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      updatedBy: {
        userId: "1",
        firstName: "Quang",
        lastName: "Khanh"
      }
    }
  ];

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  const handleGetContests = async ({
    searchName,
    startTimeFilter = ContestStartTimeFilterEnum.ALL,
    pageNo = 0,
    pageSize = 10
  }: {
    searchName: string;
    startTimeFilter: ContestStartTimeFilterEnum;
    pageNo?: number;
    pageSize?: number;
  }) => {
    try {
      const getCertificateCoursesResponse = await ContestService.getContests({
        searchName,
        startTimeFilter,
        pageNo,
        pageSize
      });
      console.log("getCertificateCoursesResponse", getCertificateCoursesResponse);
    } catch (error: any) {
      console.error("Failed to fetch contests", {
        code: error.response?.code || 503,
        status: error.response?.status || "Service Unavailable",
        message: error.response?.message || error.message
      });
      // Show snackbar here
    }
  };

  useEffect(() => {
    handleGetContests({
      searchName: "",
      startTimeFilter: ContestStartTimeFilterEnum.ALL
    });
  }, []);

  return (
    <Box
      sx={{
        padding: "20px",
        "& .MuiDataGrid-root": {
          border: "1px solid #e0e0e0",
          borderRadius: "4px"
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Heading1 translate-key='common_contest_management'>
            {t("common_contest_management")}
          </Heading1>
        </Grid>
        <Grid item xs={12}>
          <ContestManagementFeatureBar />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            dataList={contestList}
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
  );
};

export default ContestManagement;
