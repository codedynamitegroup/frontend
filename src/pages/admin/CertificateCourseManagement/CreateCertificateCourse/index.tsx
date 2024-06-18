import { Collapse, Container, Divider, Grid, ListItemButton } from "@mui/material";
import CustomBreadCrumb from "components/common/Breadcrumb";
import Heading3 from "components/text/Heading3";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { SkillLevelEnum } from "models/coreService/enum/SkillLevelEnum";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormRegister,
  useFieldArray,
  useForm
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { routes } from "routes/routes";
import { TopicService } from "services/coreService/TopicService";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextFieldColumn from "components/common/inputs/InputTextFieldColumn";
import JoySelect from "components/common/JoySelect";
import TitleWithInfoTip from "components/text/TitleWithInfo";
import TextEditor from "components/editor/TextEditor";
import Card from "@mui/joy/Card";
import ParagraphBody from "components/text/ParagraphBody";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Button, { BtnType } from "components/common/buttons/Button";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/joy/IconButton";
import EditOffRoundedIcon from "@mui/icons-material/EditOffRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

interface FormData {
  name: string;
  description?: string;
  skillLevel: string;
  topicId: string;
  chapters?: ChapterData[];
}

interface ChapterData {
  title: string;
  description?: string;
  resources: ChapterResourceData[];
}

interface ChapterResourceData {
  resourceType: string;
  title: string;
  questionId?: string;
  lessonHtml?: string;
  youtubeVideoUrl?: string;
}
interface ChapterFieldArrayPropsData {
  field: FieldArrayWithId<FormData, "chapters", "id">;
  removeChapter: UseFieldArrayRemove;

  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  parentIndex: number;
}
interface ChapterResourceFieldArrayPropsData {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;

  index: number;
  parentIndex: number;
  isEditting?: boolean;
  removeResource: UseFieldArrayRemove;
}

const CreateCertificateCourse = () => {
  const { t } = useTranslation();
  const [topicList, setTopicList] = useState<TopicEntity[]>([]);
  const [skeleton, setSkeleton] = useState<boolean>(true);

  const breadCrumbData = [
    {
      navLink: routes.admin.dashboard,
      label: "Home"
    },
    {
      navLink: routes.admin.certificate.root,
      label: "Certificate Course Management"
    }
  ];

  const getTopicListData = async () => {
    try {
      const response = await TopicService.getTopics({
        pageNo: 0,
        pageSize: 999999,
        fetchAll: true
      });
      setTopicList(response.topics);

      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getTopicListData();
      setSkeleton(false);
    };
    fetchData();
  }, []);

  const skillLevelOptions = useMemo(() => {
    return Object.values(SkillLevelEnum).map((skillLevel) => ({
      label: t(skillLevel),
      value: skillLevel
    }));
  }, [t]);

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("name_required")),
      description: yup.string(),
      skillLevel: yup.string().required(t("skill_level_required")),
      topicId: yup.string().required(t("topic_required"))
    });
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters"
  });
  const handleAddNewChapter = () => {
    append({
      title: "",
      resources: []
    });
  };
  console.log("error:", errors);

  const submitHandler = async (data: any) => {
    console.log("data", data);
  };

  return (
    <>
      <Helmet>
        <title>{t("create_certificate_course")}</title>
      </Helmet>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Container>
          <Box
            sx={{
              paddingLeft: "13px"
            }}
          >
            <CustomBreadCrumb
              breadCrumbData={breadCrumbData}
              lastBreadCrumbLabel='Create Certificate Course'
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
              <Heading3 translate-key='create_certificate_course_title'>
                {t("create_certificate_course_title").toUpperCase()}
              </Heading3>
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
            <Grid item sm={12} md={6}>
              <Grid container spacing={2}>
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
                        title={`${t("certificate_course_name")}`}
                        type='text'
                        placeholder={t("enter_certificate_course_name")}
                        titleRequired={true}
                        translation-key={[
                          "certificate_course_name",
                          "enter_certificate_course_name"
                        ]}
                        inputRef={ref}
                        {...field}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TitleWithInfoTip
                    translation-key='certificate_course_skill_level_title'
                    title={`${t("certificate_course_skill_level_title")} `}
                    titleRequired
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Controller
                    name='skillLevel'
                    control={control}
                    defaultValue={skillLevelOptions[0].value}
                    render={({ field: { onChange, value } }) => (
                      <JoySelect value={value} onChange={onChange} options={skillLevelOptions} />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TitleWithInfoTip
                    translation-key='certificate_course_topic_title'
                    title={`${t("certificate_course_topic_title")} `}
                    titleRequired
                    fontSize='12px'
                    color='var(--gray-60)'
                    gutterBottom
                    fontWeight='600'
                  />
                  <Controller
                    name='topicId'
                    control={control}
                    defaultValue={topicList[0]?.topicId}
                    render={({ field: { onChange, value } }) => (
                      <JoySelect
                        value={value}
                        onChange={onChange}
                        options={topicList.map((topic) => ({
                          label: topic.name,
                          value: topic.topicId
                        }))}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} md={6}>
              <TitleWithInfoTip
                translation-key='certificate_course_description_title'
                title={`${t("certificate_course_description_title")} `}
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
                    title={t("certificate_course_description_title")}
                    openDialog
                    roundedBorder={true}
                    error={Boolean(errors?.description)}
                    placeholder={`${t("enter_certificate_course_description_title")}...`}
                    required
                    translation-key='enter_certificate_course_description_title'
                    maxLines={10}
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Card
                variant='soft'
                color='primary'
                sx={{
                  padding: "10px",
                  marginTop: "30px"
                }}
              >
                <ParagraphBody fontWeight={"600"} colorname='--blue-2'>
                  {t("common_detail").toUpperCase()}
                </ParagraphBody>
              </Card>

              <Button
                margin='10px 0'
                variant='outlined'
                colorName={"var(--blue-light)"}
                borderRadius='12px'
                startIcon={<AddCircleRoundedIcon />}
                onClick={handleAddNewChapter}
              >
                <ParagraphBody fontSize={"12px"} fontWeight={"500"} colorname='--blue-light-1'>
                  {t("common_add_chapter")}
                </ParagraphBody>
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={4}>
                {fields.map((field, index) => (
                  <Grid item xs={12} key={field.id}>
                    <ChapterItem
                      field={field}
                      removeChapter={() => remove(index)}
                      parentIndex={index}
                      {...{ control, register }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />

              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                justifyContent={"center"}
                mt={2}
              >
                <Button btnType={BtnType.Outlined}>
                  <ParagraphBody fontWeight={"600"} colorname='--eerie-black'>
                    {t("common_cancel")}
                  </ParagraphBody>
                </Button>
                <Button btnType={BtnType.Primary} type='submit'>
                  <ParagraphBody fontWeight={"600"} colorname='--white'>
                    {t("common_save")}
                  </ParagraphBody>
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </form>
    </>
  );
};

const ChapterItem = (props: ChapterFieldArrayPropsData) => {
  const { t } = useTranslation();
  const { field, removeChapter, control, register, parentIndex } = props;
  const [open, setOpen] = useState(true);
  const [isEditting, setIsEditting] = useState(true);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `chapters.${parentIndex}.resources`
  });

  const handleNewResource = () => {
    append({
      resourceType: ResourceTypeEnum.LESSON,
      title: "",
      lessonHtml: "",
      questionId: "",
      youtubeVideoUrl: ""
    });
  };

  return (
    <div>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"flex-start"}
        marginBottom={"10px"}
      >
        <IconButton
          variant={isEditting ? "soft" : "solid"}
          onClick={() => {
            setIsEditting(!isEditting);
          }}
          color='primary'
        >
          {isEditting ? <EditOffRoundedIcon /> : <EditRoundedIcon />}
        </IconButton>
        <IconButton
          variant='soft'
          sx={{
            marginLeft: "10px"
          }}
          color='danger'
          onClick={() => {
            removeChapter();
          }}
        >
          <DeleteForeverRoundedIcon />
        </IconButton>
      </Box>
      <Card
        variant='soft'
        color='neutral'
        sx={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "var(--blue-light-4)"
          }
        }}
        onClick={() => setOpen(!open)}
        translation-key='question_management_answer'
      >
        <ParagraphBody fontWeight={"600"} colorname='--eerie-black'>
          {"Chapter " + parentIndex}
        </ParagraphBody>

        {open ? <ArrowDropDownRoundedIcon /> : <ArrowDropUpRoundedIcon />}
      </Card>

      <Collapse in={open} timeout='auto'>
        {isEditting && (
          <Grid
            container
            spacing={2}
            sx={{
              marginBottom: "40px",
              marginTop: "5px"
            }}
          >
            <Grid item sm={12} md={6}>
              <Controller
                control={control}
                name={`chapters.${parentIndex}.title`}
                render={({ field: { ref, ...field } }) => (
                  <InputTextFieldColumn
                    useDefaultTitleStyle
                    title={`${"Chapter Title"}`}
                    inputRef={ref}
                    type='text'
                    placeholder={"Enter Chapter Title"}
                    titleRequired={true}
                    translation-key={["chapter_title", "enter_chapter_title"]}
                    {...field}
                  />
                )}
              />

              <Button
                margin='10px 0'
                variant='outlined'
                colorName={"var(--blue-light)"}
                borderRadius='12px'
                startIcon={<AddCircleRoundedIcon />}
                onClick={handleNewResource}
              >
                <ParagraphBody fontSize={"12px"} fontWeight={"500"} colorname='--blue-light-1'>
                  {t("common_add_chapter_resource")}
                </ParagraphBody>
              </Button>
            </Grid>
            <Grid item sm={12} md={6}>
              <TitleWithInfoTip
                translation-key='chapter_description_title'
                title={`${"Chapter Description"} `}
                titleRequired
                fontSize='12px'
                color='var(--gray-60)'
                gutterBottom
                fontWeight='600'
              />
              <Controller
                control={control}
                name={`chapters.${parentIndex}.description`}
                render={({ field }) => (
                  <TextEditor
                    title={"Chapter Description"}
                    openDialog
                    roundedBorder={true}
                    error={false}
                    placeholder={"Enter Chapter Description"}
                    required
                    translation-key='enter_chapter_description'
                    maxLines={10}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        )}

        {/* {fields.length !== 0 && ( */}
        <Card
          sx={{
            marginTop: "10px"
          }}
        >
          <Stack spacing={{ xs: 4 }} useFlexGap>
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <ChapterResourceItem
                  parentIndex={parentIndex}
                  isEditting={isEditting}
                  index={index}
                  removeResource={() => remove(index)}
                  {...{ control, register }}
                />
                <Divider />
              </React.Fragment>
            ))}
          </Stack>
        </Card>
        {/* )} */}
      </Collapse>
    </div>
  );
};

const ChapterResourceItem = (props: ChapterResourceFieldArrayPropsData) => {
  const { isEditting, removeResource, index, control, register, parentIndex } = props;

  const { t } = useTranslation();
  const resourceTypeOptions = useMemo(() => {
    return Object.values(ResourceTypeEnum).map((resourceType) => ({
      label: t(resourceType),
      value: resourceType
    }));
  }, [t]);
  const [resourceType, setResourceType] = useState(ResourceTypeEnum.LESSON);

  return (
    <>
      <Stack>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
          <IconButton
            variant='soft'
            sx={{
              marginLeft: "10px"
            }}
            color='danger'
            onClick={() => {
              removeResource();
            }}
          >
            <DeleteForeverRoundedIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          {isEditting && (
            <>
              <Grid item xs={6}>
                <Controller
                  name={`chapters.${parentIndex}.resources.${index}.title`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <InputTextFieldColumn
                      inputRef={ref}
                      useDefaultTitleStyle
                      title={`${t("chapter_resource_title")}`}
                      type='text'
                      placeholder={t("enter_chapter_resource_title")}
                      titleRequired={true}
                      translation-key={["chapter_resource_title", "enter_chapter_resource_title"]}
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TitleWithInfoTip
                  translation-key='resource_type_title'
                  title={`${t("resource_type_title")} `}
                  titleRequired
                  fontSize='12px'
                  color='var(--gray-60)'
                  gutterBottom
                  fontWeight='600'
                />
                <Controller
                  name={`chapters.${parentIndex}.resources.${index}.resourceType`}
                  control={control}
                  defaultValue={resourceTypeOptions[0].value}
                  render={({ field: { onChange, value } }) => (
                    <JoySelect
                      value={value}
                      onChange={(newValue: any) => {
                        onChange(newValue);
                        setResourceType(newValue);
                      }}
                      options={resourceTypeOptions}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {resourceType === ResourceTypeEnum.LESSON && (
                  <Controller
                    name={`chapters.${parentIndex}.resources.${index}.lessonHtml`}
                    control={control}
                    render={({ field }) => (
                      <TextEditor
                        title={"Lesson"}
                        openDialog
                        roundedBorder={true}
                        error={false}
                        placeholder={"Enter Lesson"}
                        required
                        translation-key='enter_lesson'
                        maxLines={10}
                        {...field}
                      />
                    )}
                  />
                )}
                {resourceType === ResourceTypeEnum.VIDEO && <>VIDEO</>}
                {resourceType === ResourceTypeEnum.CODE && <>QUESTION</>}
              </Grid>
            </>
          )}
        </Grid>
        {!isEditting && (
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Box
              sx={{
                backgroundColor: "#FFEBEE",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
                padding: "10px"
              }}
            >
              <SmartDisplayRoundedIcon
                sx={{
                  color: "#D32F2F"
                }}
              />
              <BookRoundedIcon
                sx={{
                  color: "#1976D2"
                }}
              />
              <CodeRoundedIcon
                sx={{
                  color: "#388E3C"
                }}
              />
            </Box>
            <ParagraphBody fontWeight={"600"} colorname='--eerie-black'>
              {"Chapter name"}
            </ParagraphBody>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default CreateCertificateCourse;
