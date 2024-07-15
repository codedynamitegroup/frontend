import { Avatar, Box, Grid, Stack } from "@mui/material";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel
} from "@mui/x-data-grid";
import CustomBreadCrumb from "components/common/Breadcrumb";
import CustomDataGrid from "components/common/CustomDataGrid";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading3 from "components/text/Heading3";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";
import { TopicService } from "services/coreService/TopicService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import ParagraphBody from "components/text/ParagraphBody";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useDispatch } from "react-redux";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Card } from "@mui/joy";

interface TopicDataGridProps extends TopicEntity {
  id: string;
}

const TopicManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [totalElement, setTotalElement] = useState<number>(0);
  const [topicList, setTopicList] = useState<TopicDataGridProps[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleGetTopic = useCallback(
    async ({
      pageNo = 0,
      pageSize = 10,
      fetchAll = false
    }: {
      pageNo?: number;
      pageSize?: number;
      fetchAll?: boolean;
    }) => {
      try {
        const response = await TopicService.getTopics({
          pageNo,
          pageSize,
          fetchAll
        });

        if (response.topics) {
          setTotalElement(response.totalItems);
          setTopicList(
            response.topics.map((topic: TopicEntity) => ({ ...topic, id: topic.topicId }))
          );
        } else {
          setTotalElement(0);
          setTopicList([]);
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const handleDeleteTopic = async () => {
    TopicService.deleteTopicById(deleteTopicId)
      .then(() => {
        dispatch(setSuccessMess(t("delete_topic_success")));
        handleGetTopic({});
      })
      .catch((error: any) => {
        dispatch(setErrorMess(error.message));
      })
      .finally(() => {
        setIsDeleteLoading(false);
        setIsOpenConfirmDelete(false);
      });
  };
  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    setIsDeleteLoading(true);
    handleDeleteTopic();
  };
  const handleSearchChange = useCallback((value: string) => {}, []);

  const tableHeading: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("topic_name"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("topic_name")}
            </ParagraphBody>
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
              <Avatar alt={params.row.name} src={params.row.thumbnailUrl} />

              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.name}
              </ParagraphBody>
            </Stack>
          );
        }
      },
      {
        field: "description",
        headerName: t("description"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("description")}
            </ParagraphBody>
          );
        }
      },
      {
        field: "isSingleProgrammingLanguage",
        headerName: t("is_single_programming_language"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("is_single_programming_language")}
            </ParagraphBody>
          );
        },
        renderCell: (params) => {
          return (
            <Card
              color={params.row.isSingleProgrammingLanguage ? "primary" : "warning"}
              variant='soft'
              sx={{ padding: "8px", borderRadius: "20px" }}
            >
              <ParagraphBody fontSize={".875rem"} color={"#222222"} fontWeight={"600"}>
                {params.row.isSingleProgrammingLanguage ? t("single") : t("multiple")}
              </ParagraphBody>
            </Card>
          );
        }
      },
      {
        field: "numOfCertificateCourses",
        headerName: t("num_of_certificate_courses"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("num_of_certificate_courses")}
            </ParagraphBody>
          );
        }
      },
      {
        field: "action",
        headerName: t("common_action"),
        type: "actions",
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("common_action")}
            </ParagraphBody>
          );
        },
        getActions: (params: any) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label='Edit'
              onClick={() => {
                navigate(
                  routes.admin.certificate.detail.replace(":id", params.row.certificateCourseId)
                );
              }}
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label='Delete'
              onClick={() => {
                console.log(params.row.topicId);
                setDeleteTopicId(params.row.topicId);
                setIsOpenConfirmDelete(true);
              }}
            />
          ];
        }
      }
    ],
    []
  );
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);

    handleGetTopic({
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      handleGetTopic({});
    };
    fetchData();
  }, [handleGetTopic]);
  return (
    <>
      <Helmet>
        <title>{t("topic_management")}</title>
      </Helmet>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_description")}
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
        deleting={isDeleteLoading}
      />
      <Box
        sx={{
          paddingLeft: "13px"
        }}
      >
        <CustomBreadCrumb
          breadCrumbData={[{ navLink: routes.admin.dashboard, label: "Home" }]}
          lastBreadCrumbLabel={t("topic_management")}
        />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          padding: "0 20px"
        }}
      >
        <Grid item xs={12}>
          <Heading3 translate-key='topic_management'>
            {t("topic_management").toUpperCase()}
          </Heading3>
        </Grid>
        <Grid item xs={12}>
          <CustomSearchFeatureBar
            isFilter={false}
            isLoading={isLoading}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onHandleChange={handleSearchChange}
            createBtnText={t("topic_add_btn")}
            onClickCreate={() => {
              //   navigate(routes.admin.certificate.create);
            }}
            numOfResults={totalElement}
            // filterKeyList={[
            //   {
            //     label: t("common_status"),
            //     value: "Status"
            //   }
            // ]}
            // filterValueList={{
            //   Status: [
            //     {
            //       label: t("common_all"),
            //       value: ContestStartTimeFilterEnum.ALL
            //     },
            //     {
            //       label: t("common_upcoming"),
            //       value: ContestStartTimeFilterEnum.UPCOMING
            //     },
            //     {
            //       label: t("common_in_progress"),
            //       value: ContestStartTimeFilterEnum.HAPPENING
            //     },
            //     {
            //       label: t("common_ended"),
            //       value: ContestStartTimeFilterEnum.ENDED
            //     }
            //   ] as { label: string; value: string }[]
            // }}
            // filters={filters}
            // handleChangeFilters={(filters: { key: string; value: string }[]) => {
            //   setFilters(filters);
            // }}
            // onHandleApplyFilter={handleApplyFilter}
            // onHandleCancelFilter={handleCancelFilter}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            loading={isLoading}
            dataList={topicList}
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
              minHeight: "500px"
            }}
            personalSx={true}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TopicManagement;
