import { Avatar, Grid, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  GridCallbackDetails,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import CustomDataGrid from "components/common/CustomDataGrid";
import Heading5 from "components/text/Heading5";
import ParagraphSmall from "components/text/ParagraphSmall";
import i18next from "i18next";
import { ContestUserEntity } from "models/coreService/entity/ContestUserEntity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContestService } from "services/coreService/ContestService";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { standardlizeUTCStringToLocaleString } from "utils/moment";

const OrgAdminContestEditSignUps = () => {
  const { t } = useTranslation();

  const { contestId } = useParams<{ contestId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [signUps, setSignUps] = useState<ContestUserEntity[]>([]);

  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const tableHeading: GridColDef[] = [
    {
      field: "no",
      headerName: t("common_no"),
      flex: 0.4,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_no")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.no}</ParagraphSmall>;
      }
    },
    {
      field: "email",
      headerName: t("common_email"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_email")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Stack
            direction='row'
            gap={2}
            alignItems='center'
            justifyContent='flex-start'
            margin={"5px"}
          >
            <Avatar
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${params.row.email}`)}`
              }}
              alt={params.row.email}
              src={params.row.avatarUrl}
            >
              {params.row.email.charAt(0)}
            </Avatar>
            <ParagraphSmall width={"auto"} fontWeight={500}>
              {params.row.email}
            </ParagraphSmall>
          </Stack>
        );
      }
    },
    {
      field: "createdAt",
      headerName: t("contest_sign_up_date"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("contest_sign_up_date")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.createdAt as string, currentLang)}
          </ParagraphSmall>
        );
      }
    }
  ];

  const handleGetSignUpsByContestId = useCallback(
    async (id: string, page: number, size: number) => {
      setIsLoading(true);
      try {
        const signUpsResponse = await ContestService.getSignUpsOfContest(id, page, size, false);
        setSignUps(signUpsResponse.contestUsers);
        setIsLoading(false);
      } catch (error: any) {
        console.error("error", error);
        setIsLoading(false);
      }
    },
    []
  );

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = 100;
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    if (contestId) {
      setPage(model.page);
      setPageSize(model.pageSize);
      handleGetSignUpsByContestId(contestId, model.page, model.pageSize);
    }
  };
  const rowClickHandler = (params: GridRowParams<any>) => {
    // console.log(params);
  };

  const dataList = useMemo(() => {
    return signUps.map((signUp: ContestUserEntity, index) => {
      return {
        id: `${signUp.contestId}${signUp.user.userId}`,
        no: index + 1,
        email: signUp.user?.email || "",
        createdAt: signUp.createdAt,
        avatarUrl: signUp.user?.avatarUrl || ""
      };
    });
  }, [signUps]);

  useEffect(() => {
    if (contestId) handleGetSignUpsByContestId(contestId, page, pageSize);
  }, [contestId, handleGetSignUpsByContestId, page, pageSize]);

  if (!contestId) return null;

  return (
    <Grid
      container
      gap={2}
      direction='column'
      sx={{
        margin: "0px 20px 20px 20px",
        width: "calc(100% - 40px)",
        minHeight: "600px"
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          padding: "20px"
        }}
      >
        <Grid item xs={12}>
          <CustomDataGrid
            loading={isLoading}
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
            sx={{
              "& .MuiDataGrid-cell": {
                border: "none"
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f9fb"
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "#f5f9fb"
              }
            }}
            personalSx={true}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrgAdminContestEditSignUps;
