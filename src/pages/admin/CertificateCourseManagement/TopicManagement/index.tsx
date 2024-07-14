import { Box, Grid } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import CustomBreadCrumb from "components/common/Breadcrumb";
import CustomDataGrid from "components/common/CustomDataGrid";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import Heading3 from "components/text/Heading3";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";

interface TopicDataGridProps extends TopicEntity {
  id: string;
}

const TopicManagement = () => {
  const { t } = useTranslation();
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedTopicManagement, setDeletedTopicManagement] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalElement = useMemo(() => 0, []);
  const topicList: TopicDataGridProps[] = useMemo(() => [], []);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {};
  const handleSearchChange = useCallback((value: string) => {
    //   handleGetCertificateCourses({
    //     searchName: value
    //   });
  }, []);

  const tableHeading: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("topic_name"),
        flex: 1
      },
      {
        field: "description",
        headerName: t("description"),
        flex: 1
      },
      {
        field: "action",
        headerName: t("common_action"),
        flex: 1,
        renderCell: (params: any) => {
          return (
            <Box>
              <button
                onClick={() => {
                  //   navigate(routes.admin.certificate.edit(params.row.id));
                }}
              >
                {t("common_edit")}
              </button>
              <button
                onClick={() => {
                  setIsOpenConfirmDelete(true);
                  setDeletedTopicManagement(params.row.id);
                }}
              >
                {t("common_delete")}
              </button>
            </Box>
          );
        }
      }
    ],
    []
  );

  return <></>;
};

export default TopicManagement;
