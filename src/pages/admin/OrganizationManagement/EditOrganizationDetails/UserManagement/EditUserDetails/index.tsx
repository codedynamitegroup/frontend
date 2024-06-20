import { Avatar, Box, Divider, Grid } from "@mui/material";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "routes/routes";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { User } from "models/authService/entity/user";
import { UserService } from "services/authService/UserService";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import ParagraphBody from "components/text/ParagraphBody";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";
import images from "config/images";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button, { BtnType } from "components/common/buttons/Button";

const EditUserDetailsOrganization = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const [user, setUser] = useState<User>();

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const handleGetUserById = useCallback(async (id: string) => {
    try {
      const userResponse = await UserService.getUserById(id);
      if (userResponse) {
        setUser(userResponse);
      }
    } catch (error: any) {
      console.error("error", error);
    }
  }, []);

  useEffect(() => {
    if (!user && userId) {
      handleGetUserById(userId);
    }
  }, [user, handleGetUserById, userId]);
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          btnType={BtnType.Text}
          onClick={() => {
            if (organizationId) {
              navigate(
                routes.admin.organizations.edit.list_users.replace(
                  ":organizationId",
                  organizationId
                )
              );
            }
          }}
        >
          Quay lại
        </Button>
        <Box
          sx={{
            padding: "0px 20px 20px 20px"
          }}
        >
          <Heading1 translate-key='common_account_info'>{t("common_account_info")}</Heading1>
          <Box component='form' className={classes.formBody}>
            <Grid container columns={12} justifyContent={"center"}>
              <Avatar
                sx={{
                  bgcolor: `${generateHSLColorByRandomText(`${user?.firstName} ${user?.lastName}`)}`,
                  width: 150,
                  height: 150,
                  fontSize: "60px"
                }}
                alt={user?.email}
                src={user?.avatarUrl}
              >
                {user?.firstName.charAt(0)}
              </Avatar>
            </Grid>
            <InputTextField
              title={t("common_organization_name")}
              type='text'
              disabled
              value={user?.organization.name}
              width='100%'
            />
            <Grid container spacing={1} columns={12}>
              <Grid item xs={4}>
                <TextTitle translation-key='common_phone'>{t("common_phone")}</TextTitle>
              </Grid>
              <Grid item xs={7} display={"flex"} flexDirection={"column"} gap={"10px"}>
                <PhoneInput
                  placeholder='Enter phone number'
                  value={user?.phone}
                  onChange={() => {}}
                  disabled
                  className={classes.phoneInput}
                />
              </Grid>
            </Grid>
            <InputTextField
              title={t("common_last_login")}
              type='text'
              disabled
              value={standardlizeUTCStringToLocaleString(user?.lastLogin as string, currentLang)}
              width='100%'
            />
            <InputTextField
              title={t("Email")}
              type='text'
              disabled
              value={user?.email}
              width='100%'
            />
            <InputTextField
              title={t("first_name")}
              type='text'
              disabled
              value={user?.firstName}
              width='100%'
            />
            <InputTextField
              title={t("last_name")}
              type='text'
              disabled
              value={user?.lastName}
              width='100%'
            />
            {user && (
              <>
                <Grid container spacing={1} columns={12}>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {images.logo.moodleLogo && (
                      <Avatar
                        alt='Google'
                        src={images.logo.googleLogo}
                        sx={{
                          width: "40px",
                          height: "40px"
                        }}
                      />
                    )}
                    <ParagraphBody
                      sx={{
                        marginLeft: "5px"
                      }}
                    >
                      Google
                    </ParagraphBody>
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    sx={{
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {user?.isLinkedWithGoogle ? (
                      <ParagraphBody translation-key='user_detail_dialog_linked'>
                        {t("user_detail_dialog_linked")}
                      </ParagraphBody>
                    ) : (
                      <ParagraphBody translation-key='user_detail_dialog_not_linked'>
                        {t("user_detail_dialog_not_linked")}
                      </ParagraphBody>
                    )}
                  </Grid>
                </Grid>
                <Divider />

                <Grid container spacing={1} columns={12}>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {images.logo.moodleLogo && (
                      <Avatar
                        alt='Microsoft'
                        src={images.logo.microsoftLogo}
                        sx={{
                          width: "40px",
                          height: "40px"
                        }}
                      />
                    )}
                    <ParagraphBody
                      sx={{
                        marginLeft: "5px"
                      }}
                    >
                      Microsoft
                    </ParagraphBody>
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    sx={{
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {user?.isLinkedWithMicrosoft ? (
                      <ParagraphBody translation-key='user_detail_dialog_linked'>
                        {t("user_detail_dialog_linked")}
                      </ParagraphBody>
                    ) : (
                      <ParagraphBody translation-key='user_detail_dialog_not_linked'>
                        {t("user_detail_dialog_not_linked")}
                      </ParagraphBody>
                    )}
                  </Grid>
                </Grid>
                <Divider />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EditUserDetailsOrganization;
