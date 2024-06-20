import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, Divider, Grid, TextareaAutosize } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import * as yup from "yup";
import classes from "./styles.module.scss";
import JoyButton from "@mui/joy/Button";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import TextTitle from "components/text/TextTitle";
import PhoneInput from "react-phone-number-input";
import ErrorMessage from "components/text/ErrorMessage";
import CustomBreadCrumb from "components/common/Breadcrumb";
import { CreateOrganizationRequest } from "models/authService/entity/organization";
import { OrganizationService } from "services/authService/OrganizationService";

interface IFormDataType {
  email: string;
  description?: string;
  name: string;
  phone: string;
  address: string;
}

const CreateOrganization = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().required(t("email_required")).email(t("email_invalid")),
      name: yup.string().required(t("organization_name_required")),
      description: yup.string(),
      address: yup.string().required(t("organization_address_required")),
      phone: yup
        .string()
        .matches(/^\+?[1-9][0-9]{7,14}$/, t("phone_number_invalid"))
        .required(t("phone_required"))
    });
  }, [t]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register
  } = useForm<IFormDataType>({
    resolver: yupResolver(schema)
  });

  const submitHandler = async (data: any) => {
    const formSubmittedData: IFormDataType = { ...data };
    const createdOrganizationRequest: CreateOrganizationRequest = {
      email: formSubmittedData.email,
      description: formSubmittedData.description,
      name: formSubmittedData.name,
      address: formSubmittedData.address,
      phone: formSubmittedData.phone
    };
    await handleCreateOrganization(createdOrganizationRequest);
  };

  const handleCreateOrganization = useCallback(
    async (createOrganizationRequest: CreateOrganizationRequest) => {
      setSubmitLoading(true);
      try {
        await OrganizationService.createOrganization(createOrganizationRequest);
        setSubmitLoading(false);
        dispatch(setSuccessMess("Created organization successfully"));
        navigate(routes.admin.organizations.root);
      } catch (error: any) {
        console.error("error", error);
        dispatch(
          setErrorMess("Organization creation failed!!! please check your input information")
        );
        if (error.code === 401 || error.code === 403) {
          dispatch(setErrorMess(t("common_please_login_to_continue")));
        }
        setSubmitLoading(false);
      }
    },
    [t]
  );
  return (
    <>
      <Card
        sx={{
          margin: "20px",
          // padding: "20px",
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <CustomBreadCrumb
              breadCrumbData={[
                { navLink: routes.admin.organizations.root, label: t("organization_management") }
              ]}
              lastBreadCrumbLabel={t("organization_create")}
            />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: "20px"
          }}
        >
          <Heading1 translate-key='user_create'>{t("organization_create")}</Heading1>
          <Box component='form' className={classes.formBody} onSubmit={handleSubmit(submitHandler)}>
            <Grid container spacing={1} columns={12}>
              <Grid item xs={4}>
                <TextTitle translation-key='common_phone'>{t("common_phone")}</TextTitle>
              </Grid>
              <Grid item xs={7} display={"flex"} flexDirection={"column"} gap={"10px"}>
                <Controller
                  control={control}
                  name='phone'
                  render={({ field }) => {
                    return (
                      <PhoneInput
                        value={field.value}
                        placeholder='Enter phone number'
                        onChange={field.onChange}
                        className={classes.phoneInput}
                        defaultCountry='VN'
                      />
                    );
                  }}
                />
                {errors.phone?.message && <ErrorMessage>{errors.phone?.message}</ErrorMessage>}
              </Grid>
            </Grid>

            <InputTextField
              title={t("Email")}
              type='text'
              inputRef={register("email")}
              errorMessage={errors?.email?.message}
              width='100%'
            />
            <InputTextField
              title={t("organization_name")}
              type='text'
              inputRef={register("name")}
              errorMessage={errors?.name?.message}
              width='100%'
            />
            <InputTextField
              title={t("organization_address")}
              type='text'
              inputRef={register("address")}
              errorMessage={errors?.address?.message}
              width='100%'
            />
            <Grid container spacing={1} columns={12}>
              <Grid item xs={4}>
                <TextTitle translation-key='common_description'>
                  {t("common_description")}
                </TextTitle>
              </Grid>
              <Grid item xs={7} display={"flex"} flexDirection={"column"} gap={"10px"}>
                <TextareaAutosize
                  aria-label='empty textarea'
                  translation-key='common_description'
                  placeholder={t("common_description")}
                  className={classes.textArea}
                  minRows={5}
                  {...register("description")}
                  aria-invalid={errors.description ? true : false}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <JoyButton
                loading={submitLoading}
                variant='solid'
                type='submit'
                translation-key='user_create'
              >
                {t("organization_create")}
              </JoyButton>
            </Grid>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default CreateOrganization;
