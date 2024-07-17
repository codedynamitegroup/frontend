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
type Props = {};

interface IFormDataType {
  isDeleted: boolean;
}

const CourseDetails = (props: Props) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      isDeleted: yup.boolean().required(t("organization_is_deleted_required"))
    });
  }, [t]);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [course, setCourse] = useState<CourseEntity>();

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const handleGetCourseById = useCallback(
    async (id: string) => {
      try {
        const courseResponse = await CourseService.getCourseDetail(id);
        // if (organizationResponse) {
        //   reset({
        //     isDeleted: organizationResponse.isDeleted
        //   });
        setCourse(courseResponse);
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
    const updateOrganizationBySystemAdminData: UpdateOrganizationBySystemAdminRequest = {
      isDeleted: formSubmittedData.isDeleted
    };
    await handleUpdateOrganization(updateOrganizationBySystemAdminData);
  };

  const handleUpdateOrganization = useCallback(
    async (updateOrganizationBySystemAdminRequest: UpdateOrganizationBySystemAdminRequest) => {
      setSubmitLoading(true);
      try {
        if (!courseId) {
          return;
        }
        await OrganizationService.updateOrganizationBySystemAdmin(
          courseId,
          updateOrganizationBySystemAdminRequest
        );
        setSubmitLoading(false);
        dispatch(setSuccessMess("Updated organization successfully"));
      } catch (error: any) {
        console.error("error", error);
        dispatch(
          setErrorMess("Organization is updated failed!!! please check your input information")
        );
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
        disabled
        value={course?.name}
        width='100%'
      />
      <InputTextField
        title={t("course_type_name")}
        type='text'
        disabled
        value={course?.courseType?.name}
        width='100%'
      />
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
