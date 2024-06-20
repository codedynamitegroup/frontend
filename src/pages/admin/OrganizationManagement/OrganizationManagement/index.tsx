import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Card, Checkbox, Divider, Grid, Stack } from "@mui/material";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading1 from "components/text/Heading1";
import Heading5 from "components/text/Heading5";
import ParagraphSmall from "components/text/ParagraphSmall";
import TextTitle from "components/text/TextTitle";
import i18next from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { AppDispatch, RootState } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import classes from "./styles.module.scss";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { OrganizationService } from "services/authService/OrganizationService";
import { OrganizationEntity } from "models/authService/entity/organization";
import { PaginationList } from "models/general";

interface OrganizationManagementProps {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  apiKey: string;
  moodleUrl: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isDeleted: boolean;
}

const OrganizationManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const [filters, setFilters] = useState<
    {
      key: string;
      value: string;
    }[]
  >([
    {
      key: "Status",
      value: "ALL"
    }
  ]);

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedOrganizationId, setDeletedOrganizationId] = useState<string>("");
  const [organizationsState, setOrganizationsState] = useState<PaginationList<OrganizationEntity>>({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: []
  });
  const isLoadingState = useSelector((state: RootState) => state.loading);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    OrganizationService.deleteOrganizationBySystemAdmin(deletedOrganizationId)
      .then((res) => {
        dispatch(setSuccessMess("Delete organization successfully"));
        handleGetOrganizations({
          searchName: ""
        });
      })
      .catch((error) => {
        console.error("error", error);
        dispatch(setErrorMess("Delete organization failed"));
      })
      .finally(() => {
        setIsOpenConfirmDelete(false);
      });
  };
  const dispatch = useDispatch<AppDispatch>();

  const handleGetOrganizations = useCallback(
    async ({
      searchName,
      pageNo = 0,
      pageSize = 10
    }: {
      searchName: string;
      pageNo?: number;
      pageSize?: number;
    }) => {
      dispatch(setInititalLoading(true));
      try {
        const getOrganizationsResponse = await OrganizationService.getAllOrganizations({
          searchName,
          pageNo,
          pageSize
        });
        setOrganizationsState({
          currentPage: getOrganizationsResponse.currentPage,
          totalItems: getOrganizationsResponse.totalItems,
          totalPages: getOrganizationsResponse.totalPages,
          items: getOrganizationsResponse.organizations
        });
        dispatch(setInititalLoading(false));
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        // Show snackbar here
        dispatch(setInititalLoading(false));
      }
    },
    [dispatch, t]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      handleGetOrganizations({
        searchName: value
      });
    },
    [handleGetOrganizations]
  );

  const tableHeading: GridColDef[] = [
    {
      field: "email",
      headerName: t("organization_email"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 nonoverflow width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("organization_email")}
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
            <ParagraphSmall width={"auto"} fontWeight={500}>
              {params.row.email}
            </ParagraphSmall>
          </Stack>
        );
      }
    },
    {
      field: "name",
      headerName: t("organization_name"),
      flex: 2,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("organization_name")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.name}</ParagraphSmall>;
      }
    },
    {
      field: "phone",
      headerName: t("organization_phone"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("organization_phone")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return <ParagraphSmall width={"auto"}>{params.row.phone}</ParagraphSmall>;
      }
    },
    {
      field: "updatedAt",
      headerName: t("common_updated_at"),
      flex: 1,
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_updated_at")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <ParagraphSmall width={"auto"}>
            {standardlizeUTCStringToLocaleString(params.row.updatedAt as string, currentLang)}
          </ParagraphSmall>
        );
      }
    },
    {
      field: "isDeleted",
      headerName: t("common_is_blocked"),
      flex: 0.6,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_is_blocked")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Checkbox
            disableRipple
            checked={params.row.isDeleted === true ? true : false}
            sx={{
              "&:hover": {
                backgroundColor: "transparent !important",
                cursor: "default"
              }
            }}
          />
        );
      }
    },
    {
      field: "isVerified",
      headerName: t("common_is_verified"),
      flex: 0.6,
      align: "center",
      renderHeader: () => {
        return (
          <Heading5 width={"auto"} sx={{ textAlign: "left" }} textWrap='wrap'>
            {t("common_is_verified")}
          </Heading5>
        );
      },
      renderCell: (params) => {
        return (
          <Checkbox
            disableRipple
            checked={params.row.isVerified === true ? true : false}
            sx={{
              "&:hover": {
                backgroundColor: "transparent !important",
                cursor: "default"
              }
            }}
          />
        );
      }
    },
    {
      field: "action",
      headerName: t("common_action"),
      type: "actions",
      flex: 0.8,
      renderHeader: () => {
        return (
          <TextTitle width={"auto"} sx={{ textAlign: "left" }}>
            {t("common_action")}
          </TextTitle>
        );
      },
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            onClick={() => {
              navigate(
                routes.admin.organizations.edit.details.replace(
                  ":organizationId",
                  params.row.organizationId
                ),
                {
                  state: {
                    contestName: params.row.name
                  }
                }
              );
            }}
          />,
          <GridActionsCellItem
            onClick={() => {
              setDeletedOrganizationId(params.row.organizationId);
              setIsOpenConfirmDelete(true);
            }}
            icon={<DeleteIcon />}
            label='Delete'
          />
        ];
      }
    }
  ];

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const totalElement = useMemo(
    () => organizationsState?.totalItems || 0,
    [organizationsState?.totalItems]
  );

  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {};
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);
    handleGetOrganizations({
      searchName: searchValue,
      pageNo: model.page,
      pageSize: model.pageSize
    });
  };

  const organizationListTable: OrganizationManagementProps[] = useMemo(() => {
    if (organizationsState.items.length > 0) {
      return organizationsState.items.map((organization) => ({
        id: organization.organizationId,
        organizationId: organization.organizationId,
        email: organization.email,
        name: organization.name,
        description: organization.description,
        phone: organization.phone,
        address: organization.address,
        apiKey: organization.apiKey,
        moodleUrl: organization.moodleUrl,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        isDeleted: organization.isDeleted,
        isVerified: organization.isVerified
      }));
    } else {
      return [];
    }
  }, [organizationsState.items]);

  const handleApplyFilter = useCallback(() => {
    handleGetOrganizations({
      searchName: searchValue
    });
  }, [handleGetOrganizations, searchValue]);

  const handleCancelFilter = useCallback(() => {
    handleGetOrganizations({
      searchName: searchValue
    });
  }, [handleGetOrganizations, searchValue]);

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      // dispatch(setInititalLoading(true));
      await handleGetOrganizations({
        searchName: ""
      });
      // dispatch(setInititalLoading(false));
    };

    fetchOrganizations();
  }, [dispatch, handleGetOrganizations]);

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={"Confirm delete"}
        description='Are you sure you want to delete this organization?'
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <Box>
        <Grid
          container
          spacing={2}
          sx={{
            padding: "20px"
          }}
        >
          <Grid item xs={12}>
            <Heading1 translate-key='organization_management'>
              {t("organization_management")}
            </Heading1>
          </Grid>
          <Grid item xs={12}>
            <CustomSearchFeatureBar
              isLoading={isLoadingState.loading}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onHandleChange={handleSearchChange}
              createBtnText={t("organization_create")}
              onClickCreate={() => {
                navigate(routes.admin.organizations.create);
              }}
              numOfResults={totalElement}
              filterKeyList={[
                {
                  label: t("common_status"),
                  value: "Status"
                }
              ]}
              filterValueList={{
                Status: [
                  {
                    label: t("common_all"),
                    value: "ALL"
                  },
                  {
                    label: t("common_active"),
                    value: "ACTIVE"
                  },
                  {
                    label: t("common_inactive"),
                    value: "INACTIVE"
                  }
                ]
              }}
              filters={filters}
              handleChangeFilters={(filters: { key: string; value: string }[]) => {
                setFilters(filters);
              }}
              onHandleApplyFilter={handleApplyFilter}
              onHandleCancelFilter={handleCancelFilter}
            />
          </Grid>
          <Grid item xs={12}>
            {/* #F5F9FB */}
            <CustomDataGrid
              loading={isLoadingState.loading}
              dataList={organizationListTable}
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
      </Box>
    </>
  );
};

export default OrganizationManagement;
