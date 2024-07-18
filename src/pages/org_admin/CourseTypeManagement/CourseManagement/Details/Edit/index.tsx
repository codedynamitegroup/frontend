import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  OrganizationEntity,
  UpdateOrganizationBySystemAdminRequest
} from "models/authService/entity/organization";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import TextTitle from "components/text/TextTitle";
import ErrorMessage from "components/text/ErrorMessage";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import InputTextField from "components/common/inputs/InputTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import i18next from "i18next";
import { OrganizationService } from "services/authService/OrganizationService";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import { Box, Checkbox, Grid, TextareaAutosize } from "@mui/material";
import { InputPhone } from "components/common/inputs/InputPhone";
import { CourseService } from "services/courseService/CourseService";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { IOptionItem } from "models/general";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import useAuth from "hooks/useAuth";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";
import InputSelect from "components/common/inputs/InputSelect";
import { CourseUpdateCommand } from "models/courseService/entity/update/UpdateCourseCommand";
type Props = {};

interface IFormDataType {
  isVisibled: boolean;
  name: string;
  courseType: IOptionItem;
}

const CourseDetails = (props: Props) => {
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
    formState: { errors },
    register,
    watch,
    reset
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });
  const { courseId, courseTypeId } = useParams<{ courseId: string; courseTypeId: string }>();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  const [course, setCourse] = useState<CourseEntity>();
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
    if (course) {
      reset({
        courseType: mappingCourseType(course.courseType.courseTypeId)
      });
    }
  }, [course, mappingCourseType, reset]);

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

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const handleGetCourseById = useCallback(
    async (id: string) => {
      try {
        const courseResponse: CourseEntity = await CourseService.getCourseDetail(id);
        if (courseResponse) {
          reset({
            isVisibled: courseResponse.visible,
            name: courseResponse.name
          });
          setCourse(courseResponse);
        }
        // }
      } catch (error: any) {
        console.error("error", error);
      }
    },
    [reset]
  );

  useEffect(() => {
    if (courseId && !course) {
      handleGetCourseById(courseId);
    }
  }, [course, handleGetCourseById, courseId]);

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const courseUpdateCommand: CourseUpdateCommand = {
      name: formSubmittedData.name,
      visible: formSubmittedData.isVisibled,
      courseTypeId: formSubmittedData.courseType.id
    };
    await handleUpdateCourse(courseUpdateCommand);
  };

  const handleUpdateCourse = useCallback(
    async (courseUpdateCommand: CourseUpdateCommand) => {
      setSubmitLoading(true);
      try {
        if (!courseId) {
          return;
        }
        await CourseService.editCourse(courseId, courseUpdateCommand);
        setSubmitLoading(false);
        dispatch(setSuccessMess("Updated course successfully"));
      } catch (error: any) {
        console.error("error", error);
        dispatch(setErrorMess("Course is updated failed!!! please check your input information"));
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [dispatch, t, courseId]
  );

  return (
    <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
      {course?.createdAt && (
        <InputTextField
          title={t("common_created_at")}
          type='text'
          disabled
          value={standardlizeUTCStringToLocaleString(course?.createdAt as string, currentLang)}
          width='100%'
        />
      )}

      {course?.updatedAt && (
        <InputTextField
          title={t("common_updated_at")}
          type='text'
          disabled
          value={standardlizeUTCStringToLocaleString(course?.updatedAt as string, currentLang)}
          width='100%'
        />
      )}

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
        <Grid item xs={9} display={"flex"} flexDirection={"row"} alignItems={"center"} gap={"10px"}>
          <Controller
            control={control}
            name='isVisibled'
            render={({ field }) => {
              return <Checkbox size='large' checked={!!field.value} {...field} name='isVisibled' />;
            }}
          />
          {errors.isVisibled?.message && <ErrorMessage>{errors.isVisibled?.message}</ErrorMessage>}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <JoyButton
          loading={submitLoading}
          variant='solid'
          type='submit'
          translation-key='common_update'
        >
          {t("common_update")}
        </JoyButton>
      </Grid>
    </Box>
  );
};

export default CourseDetails;
