import React, { useCallback, useEffect, useMemo, useState } from "react";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import TextTitle from "components/text/TextTitle";
import ErrorMessage from "components/text/ErrorMessage";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "components/common/inputs/InputTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { Box, Checkbox, Grid } from "@mui/material";
import { CourseService } from "services/courseService/CourseService";
import { IOptionItem } from "models/general";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import useAuth from "hooks/useAuth";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import InputSelect from "components/common/inputs/InputSelect";
import CustomBreadCrumb from "components/common/Breadcrumb";
import { routes } from "routes/routes";
import Heading1 from "components/text/Heading1";
import { CreateCourseCommand } from "models/courseService/entity/create/CreateCourseCommand";
type Props = {};

interface IFormDataType {
  isVisibled: boolean;
  name: string;
  courseType: IOptionItem;
}

const CreateCourse = (props: Props) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      isVisibled: yup.boolean().required(t("course_is_visibled_required")),
      name: yup.string().required(t("course_name_required")),
      courseType: yup
        .object()
        .shape({
          id: yup.string().required(),
          name: yup.string().required()
        })
        .required(t("course_type_required"))
    });
  }, [t]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    register
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });
  const { courseTypeId } = useParams<{ courseTypeId: string }>();

  const { loggedUser } = useAuth();
  const [courseTypeList, setCourseTypeList] = useState<IOptionItem[]>([]);

  const mappingCourseType = useCallback(
    (courseTypeId: string) => {
      const matchedCourseType = courseTypeList.find((courseType) => courseType.id === courseTypeId);
      return matchedCourseType;
    },
    [courseTypeList]
  );

  useEffect(() => {
    if (courseTypeId) {
      reset({
        courseType: mappingCourseType(courseTypeId)
      });
    }
  }, [courseTypeId, mappingCourseType, reset]);

  const handleGetCourseTypes = useCallback(
    async ({ pageNo = 0, pageSize = 999 }: { pageNo?: number; pageSize?: number }) => {
      if (!loggedUser?.organization) return;
      try {
        const getCourseTypesResponse = await CourseTypeService.getCourseTypeByOrganizationId(
          loggedUser?.organization.organizationId,
          {
            pageNo: pageNo,
            pageSize: pageSize
          }
        );
        setCourseTypeList(
          getCourseTypesResponse?.courseTypes?.map((courseType: CourseTypeEntity) => {
            return {
              id: courseType.courseTypeId,
              name: courseType.name
            };
          })
        );
      } catch (error: any) {
        console.error("error", error);
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
      }
    },
    [dispatch, loggedUser, t]
  );

  useEffect(() => {
    const fetchCourseTypes = async () => {
      await handleGetCourseTypes({});
    };

    fetchCourseTypes();
  }, [handleGetCourseTypes]);

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const createCourseCommand: CreateCourseCommand = {
      name: formSubmittedData.name,
      visible: formSubmittedData.isVisibled,
      courseTypeId: formSubmittedData.courseType.id,
      organizationId: loggedUser?.organization?.organizationId
    };
    await handleCreateCourse(createCourseCommand);
  };

  const handleCreateCourse = useCallback(
    async (createCourseCommand: CreateCourseCommand) => {
      setSubmitLoading(true);
      try {
        await CourseService.createCourse(createCourseCommand);
        setSubmitLoading(false);
        dispatch(setSuccessMess("Created course successfully"));
      } catch (error: any) {
        console.error("error", error);
        dispatch(setErrorMess("Course is created failed!!! please check your input information"));
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [dispatch, t]
  );

  return (
    <Grid id={classes.courseCreateRoot}>
      <Box id={classes.breadcumpWrapper}>
        <CustomBreadCrumb
          breadCrumbData={[
            {
              navLink: routes.org_admin.course_type.course.root.replace(
                ":courseTypeId",
                courseTypeId || ":courseTypeId"
              ),
              label: t("common_course_management")
            }
          ]}
          lastBreadCrumbLabel={t("course_create")}
        />
      </Box>
      <Grid item xs={12}>
        <Heading1 translate-key='course_type_management'>{t("course_type_management")}</Heading1>
      </Grid>
      <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
        <InputTextField
          title={t("course_name")}
          type='text'
          inputRef={register("name")}
          errorMessage={errors?.name?.message}
          width='100%'
        />
        <InputSelect
          fullWidth
          title={t("course_type_name")}
          name='courseType'
          control={control}
          selectProps={{
            options: courseTypeList,
            placeholder: "Select course type"
          }}
          errorMessage={(errors.courseType as any)?.id?.message}
        />

        <Grid container spacing={1} columns={12}>
          <Grid item xs={3} display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <TextTitle translation-key='course_is_visibled'>{t("course_is_visibled")}</TextTitle>
          </Grid>
          <Grid
            item
            xs={9}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={"10px"}
          >
            <Controller
              control={control}
              name='isVisibled'
              render={({ field }) => {
                return (
                  <Checkbox size='large' checked={!!field.value} {...field} name='isVisibled' />
                );
              }}
            />
            {errors.isVisibled?.message && (
              <ErrorMessage>{errors.isVisibled?.message}</ErrorMessage>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <JoyButton
            loading={submitLoading}
            variant='solid'
            type='submit'
            translation-key='common_create'
          >
            {t("common_create")}
          </JoyButton>
        </Grid>
      </Box>
    </Grid>
  );
};

export default CreateCourse;
