import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { routes } from "routes/routes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Container, Grid, Stack } from "@mui/material";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Heading3 from "components/text/Heading3";
import ParagraphBody from "components/text/ParagraphBody";
import { Card } from "@mui/joy";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import TextEditor from "components/editor/TextEditor";
import AdvancedDropzoneDemo from "components/editor/FileUploader";
import { ExtFile } from "@files-ui/react";
import JoyButton from "@mui/joy/Button";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "components/text/ErrorMessage";
import {
  GetProgrammingLanguageEntity,
  ProgrammingLanguageEntity
} from "models/coreService/entity/ProgrammingLanguageEntity";
import CustomDataGrid from "components/common/CustomDataGrid";
import {
  GridActionsCellItem,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import CustomDialog from "components/common/dialogs/CustomDialog";
import CustomSearchFeatureBar from "components/common/featurebar/CustomSearchFeaturebar";
import { TopicService } from "services/coreService/TopicService";
import { PostTopicEntity, TopicEntity } from "models/coreService/entity/TopicEntity";
import useAuth from "hooks/useAuth";
import { useDispatch } from "react-redux";
import { setSuccessMess } from "reduxes/AppStatus";

interface FormData {
  name: string;
  description: string;
  thumbnailUrl: string;
  programmingLanguageIds: (string | undefined)[];
}

const imageType =
  ".ai, .bmp, .gdraw, .gif, .ico, .jpe, .jpeg, .jpg, .pct, .pic, .pict, .png, .svg, .svgz, .tif, .tiff";
const maxFileSize = 5242880;
const maxFiles = 1;

const CreateTopic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();

  const [extFiles, setExtFiles] = useState<ExtFile[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState<number>(0);
  const [programmingLanguageList, setProgrammingLanguageList] = useState<
    ProgrammingLanguageEntity[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [openChooseLanguageDialog, setOpenChooseLanguageDialog] = useState<boolean>(false);
  const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState<string[]>([]);
  const [tempSelectedProgrammingLanguage, setTempSelectedProgrammingLanguage] = useState<
    GridRowId[]
  >([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("required")),
      description: yup.string().required(t("required")),
      thumbnailUrl: yup.string().required(t("required")),
      programmingLanguageIds: yup
        .array()
        .of(yup.string())
        .required(t("required"))
        .required(t("required"))
    });
  }, [t]);
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      thumbnailUrl: "",
      programmingLanguageIds: []
    }
  });

  const submitHandler = (data: FormData) => {
    setSubmitLoading(true);
    const formSubmittedData: FormData = { ...data };
    const user = auth.loggedUser;

    const languageIds = formSubmittedData.programmingLanguageIds.map(
      (item) => item?.toString() || ""
    );

    const newTopic: PostTopicEntity = {
      name: formSubmittedData.name,
      description: formSubmittedData.description,
      thumbnailUrl: formSubmittedData.thumbnailUrl,
      programmingLanguageIds: languageIds,
      isSingleProgrammingLanguage: formSubmittedData.programmingLanguageIds.length === 1,
      createdBy: user?.userId || "",
      updatedBy: user?.userId || ""
    };

    TopicService.createTopic(newTopic)
      .then((res) => {
        dispatch(setSuccessMess(t("create_topic_success")));
        navigate(routes.admin.topic.root);
      })
      .catch((error) => {
        dispatch(setSuccessMess(t("create_topic_fail")));
        console.log(error);
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const breadCrumbData = [
    {
      navLink: routes.admin.dashboard,
      label: t("common_dashboard")
    },
    {
      navLink: routes.admin.topic.root,
      label: t("topic_management")
    }
  ];

  const handleGetProgrammingLanguage = useCallback(
    async (page: number = 0, pageSize: number = 10) => {
      setIsLoading(true);
      TopicService.getProgrammingLanguageByIds({
        pageNo: page,
        pageSize: pageSize,
        search: "",
        selectedProgrammingLanguageIds: selectedProgrammingLanguage
      })
        .then((res) => {
          setTotalElement(res.totalItems);
          setProgrammingLanguageList(res.programmingLanguages);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [selectedProgrammingLanguage]
  );

  useEffect(() => {
    if (extFiles.length > 0) {
      setValue("thumbnailUrl", extFiles[0]?.downloadUrl || "");

      trigger("thumbnailUrl");
    } else setValue("thumbnailUrl", "");
  }, [extFiles, setValue, trigger]);

  useEffect(() => {
    const fetchData = async () => {
      handleGetProgrammingLanguage();
    };
    fetchData();
  }, [handleGetProgrammingLanguage]);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    setIsDeleteLoading(true);
  };

  const tableHeading: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("language_name"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("language_name")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.name}
              </ParagraphBody>
            </Stack>
          );
        }
      },
      {
        field: "timeLimit",
        headerName: t("topic_programming_language_time_limit"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("topic_programming_language_time_limit")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.timeLimit}
              </ParagraphBody>
            </Stack>
          );
        }
      },
      {
        field: "memoryLimit",
        headerName: t("topic_programming_language_memory_limit"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("topic_programming_language_memory_limit")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.memoryLimit}
              </ParagraphBody>
            </Stack>
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
              icon={<DeleteIcon />}
              label='Delete'
              onClick={() => {
                setSelectedProgrammingLanguage((prev) =>
                  prev.filter((item) => item !== params.row.id)
                );

                setTempSelectedProgrammingLanguage(
                  tempSelectedProgrammingLanguage.filter((item) => item !== params.row.id)
                );
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

    //   handleGetTopic({
    //     pageNo: model.page,
    //     pageSize: model.pageSize
    //   });
  };

  const handleCloseChooseLanguageDialog = () => {
    setOpenChooseLanguageDialog(false);
  };
  const handleConfirmLanguageChoose = () => {
    if (tempSelectedProgrammingLanguage.length !== 0)
      setSelectedProgrammingLanguage(
        tempSelectedProgrammingLanguage.map((item) => item.toString())
      );
    handleCloseChooseLanguageDialog();
    trigger("programmingLanguageIds");
  };
  useEffect(() => {
    setValue("programmingLanguageIds", selectedProgrammingLanguage);
  }, [selectedProgrammingLanguage]);

  return (
    <>
      <Helmet>
        <title>{t("create_topic")}</title>
      </Helmet>
      {isOpenConfirmDelete && (
        <ConfirmDelete
          isOpen={isOpenConfirmDelete}
          title={t("dialog_confirm_delete_title")}
          description={t("dialog_confirm_delete_description")}
          onCancel={onCancelConfirmDelete}
          onDelete={onDeleteConfirmDelete}
          deleting={isDeleteLoading}
        />
      )}
      {openChooseLanguageDialog && (
        <CustomDialog
          minWidth='1000px'
          open={openChooseLanguageDialog}
          title={t("topic_choose_programming_language")}
          handleClose={handleCloseChooseLanguageDialog}
          children={
            <ChooseLanguage
              selectedProgrammingLanguages={selectedProgrammingLanguage}
              setTempSelectedProgrammingLanguages={setTempSelectedProgrammingLanguage}
              tempSelectedProgrammingLanguages={tempSelectedProgrammingLanguage}
            />
          }
          onHanldeConfirm={handleConfirmLanguageChoose}
        />
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <Container
          sx={{
            paddingBottom: "20px"
          }}
        >
          <Box
            sx={{
              paddingLeft: "13px"
            }}
          >
            <CustomBreadCrumb
              breadCrumbData={breadCrumbData}
              lastBreadCrumbLabel={t("create_topic")}
            />
          </Box>
          <Grid
            container
            spacing={4}
            sx={{
              padding: "0 20px"
            }}
          >
            <Grid item xs={12}>
              <Heading3 translate-key='create_topic'>{t("create_topic").toUpperCase()}</Heading3>
            </Grid>
            <Grid item xs={12}>
              <Card
                variant='soft'
                color='primary'
                sx={{
                  padding: "10px"
                }}
              >
                <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                  {t("common_general").toUpperCase()}
                </ParagraphBody>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Controller
                defaultValue=''
                control={control}
                name='name'
                render={({ field: { ref, ...field } }) => (
                  <InputTextFieldColumn
                    useDefaultTitleStyle
                    error={Boolean(errors?.name)}
                    errorMessage={errors.name?.message}
                    title={`${t("topic_name")}`}
                    type='text'
                    placeholder={t("enter_topic_name")}
                    titleRequired={true}
                    translation-key={["enter_topic_name", "topic_name"]}
                    inputRef={ref}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item sm={12}>
              <TitleWithInfoTip
                translation-key='topic_description'
                title={`${t("topic_description")} `}
                titleRequired
                fontSize='12px'
                color='var(--gray-60)'
                gutterBottom
                fontWeight='600'
              />
              <Controller
                defaultValue=''
                control={control}
                name='description'
                render={({ field }) => (
                  <TextEditor
                    title={t("topic_description")}
                    openDialog
                    roundedBorder={true}
                    error={Boolean(errors?.description)}
                    placeholder={`${t("enter_topic_description")}...`}
                    required
                    translation-key={["topic_description", "enter_topic_description"]}
                    maxLines={10}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TitleWithInfoTip
                translation-key='topic_thumbnail'
                title={`${t("topic_thumbnail")} `}
                titleRequired
                fontSize='12px'
                color='var(--gray-60)'
                gutterBottom
                fontWeight='600'
              />
              <AdvancedDropzoneDemo
                errors={errors.thumbnailUrl?.message ? true : false}
                extFiles={extFiles}
                setExtFiles={setExtFiles}
                maxFileSize={maxFileSize}
                accept={imageType}
                maxFiles={maxFiles}
              />
              {errors.thumbnailUrl?.message && (
                <ErrorMessage>{errors.thumbnailUrl?.message}</ErrorMessage>
              )}
            </Grid>
            <Grid item xs={12}>
              <Card
                variant='soft'
                color='primary'
                sx={{
                  padding: "10px"
                }}
              >
                <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                  {t("topic_programming_language_list").toUpperCase()}
                </ParagraphBody>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <JoyButton
                sx={{
                  width: "fit-content",
                  marginBottom: "10px"
                }}
                onClick={() => {
                  setOpenChooseLanguageDialog(true);
                }}
              >
                <ParagraphBody fontWeight={"600"} colorname='--white'>
                  {t("topic_add_programming_language")}
                </ParagraphBody>
              </JoyButton>
              <CustomDataGrid
                loading={isLoading}
                dataList={programmingLanguageList}
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
                  }
                }}
                personalSx={true}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                justifyContent={"center"}
                mt={2}
              >
                <JoyButton
                  variant='outlined'
                  color='neutral'
                  onClick={() => {
                    navigate(routes.admin.topic.root);
                  }}
                >
                  <ParagraphBody fontWeight={"600"} colorname='--eerie-black'>
                    {t("common_cancel")}
                  </ParagraphBody>
                </JoyButton>
                <JoyButton variant='solid' type='submit' color='primary' loading={submitLoading}>
                  <ParagraphBody fontWeight={"600"} colorname='--white'>
                    {t("common_create")}
                  </ParagraphBody>
                </JoyButton>
              </Stack>
            </Grid>{" "}
          </Grid>
        </Container>
      </form>
    </>
  );
};

interface ChooseLanguageProps {
  selectedProgrammingLanguages: string[];
  setTempSelectedProgrammingLanguages: React.Dispatch<React.SetStateAction<GridRowId[]>>;
  tempSelectedProgrammingLanguages: GridRowId[];
}

const ChooseLanguage = (props: ChooseLanguageProps) => {
  const {
    setTempSelectedProgrammingLanguages,
    selectedProgrammingLanguages,
    tempSelectedProgrammingLanguages
  } = props;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [totalElement, setTotalElement] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [canSetRowSelection, setCanSetRowSelection] = useState<boolean>(true);
  const [programmingLanguageList, setProgrammingLanguageList] = useState<
    GetProgrammingLanguageEntity[]
  >([]);

  const handleSearchChange = useCallback((value: string) => {}, []);

  const handleGetProgrammingLanguage = useCallback(
    async (page: number = 0, pageSize: number = 10) => {
      setIsLoading(true);
      TopicService.getProgrammingLanguage({
        pageNo: page,
        pageSize: pageSize,
        search: searchValue,
        selectedProgrammingLanguageIds: selectedProgrammingLanguages
      })
        .then((res) => {
          setTotalElement(res.totalItems);
          setProgrammingLanguageList(res.programmingLanguages);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [searchValue]
  );

  useEffect(() => {
    const fetchData = async () => {
      handleGetProgrammingLanguage();
    };
    fetchData();
  }, [handleGetProgrammingLanguage]);

  const tableHeading: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: t("language_name"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("language_name")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.name}
              </ParagraphBody>
            </Stack>
          );
        }
      },
      {
        field: "timeLimit",
        headerName: t("topic_programming_language_time_limit"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("topic_programming_language_time_limit")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.timeLimit}
              </ParagraphBody>
            </Stack>
          );
        }
      },
      {
        field: "memoryLimit",
        headerName: t("topic_programming_language_memory_limit"),
        flex: 1,
        renderHeader: () => {
          return (
            <ParagraphBody fontSize={"12px"} color={"#525151"} fontWeight={"500"}>
              {t("topic_programming_language_memory_limit")}
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
              <ParagraphBody fontSize={".875rem"} color={"#212121"} fontWeight={"600"}>
                {params.row.memoryLimit}
              </ParagraphBody>
            </Stack>
          );
        }
      }
    ],
    []
  );

  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    setPage(model.page);
    setPageSize(model.pageSize);

    handleGetProgrammingLanguage(model.page, model.pageSize);
    setCanSetRowSelection(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomSearchFeatureBar
          isFilter={false}
          isLoading={isLoading}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onHandleChange={handleSearchChange}
          numOfResults={totalElement}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomDataGrid
          rowSelectionModel={tempSelectedProgrammingLanguages}
          checkboxSelection
          columnHeaderHeight={50}
          loading={isLoading}
          dataList={programmingLanguageList}
          tableHeader={tableHeading}
          onSelectData={(
            rowSelectionModel: GridRowSelectionModel,
            details: GridCallbackDetails<any>
          ) => {
            if (canSetRowSelection) setTempSelectedProgrammingLanguages(rowSelectionModel);
            setCanSetRowSelection(true);
          }}
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
            }
          }}
          personalSx={true}
        />
      </Grid>
    </Grid>
  );
};

export default CreateTopic;
