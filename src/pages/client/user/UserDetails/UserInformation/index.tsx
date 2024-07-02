import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import TextTitle from "components/text/TextTitle";
import { useEffect, useState } from "react";
import UserAvatarAndName from "./components/UserAvatarAndName";
import UserInformationDetailsDialog from "./components/UserInformationDetailsDialog";
import UserPasswordChangeDialog from "./components/UserPasswordChangeDialog";
import UserRecentActivities from "./components/UserRecentActivities";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/authService/entity/user";
import ParagraphBody from "components/text/ParagraphBody";
import { format } from "date-fns";

const UserInformation = () => {
  const { t } = useTranslation();
  const user: User = useSelector(selectCurrentUser);

  const [data, setData] = useState({
    isUserInformationDetailsModalOpen: false,
    isUserPasswordChangeModalOpen: false,
    userInfo: user
  });

  useEffect(() => {
    if (user) {
      setData({
        ...data,
        userInfo: user
      });
    }
  }, [user]);

  const onHanldeChangePassword = () => {
    setData((pre) => ({
      ...pre,
      isUserInformationDetailsModalOpen: false,
      isUserPasswordChangeModalOpen: true
    }));
  };

  return (
    <Grid id={classes.userInformationRoot}>
      <Grid container direction='row' justifyContent={"center"} gap={3}>
        <Grid item xs={3}>
          <Box className={classes.leftContainer}>
            <Box className={classes.leftBody}>
              <Heading1
                sx={{
                  textAlign: "center"
                }}
                translation-key='user_detail_account_management'
              >
                {t("user_detail_account_management")}
              </Heading1>
              {data.userInfo?.firstName && data.userInfo?.lastName && (
                <UserAvatarAndName
                  displayName={`${data.userInfo?.firstName} ${data.userInfo?.lastName}`}
                  avatarUrl={data.userInfo?.avatarUrl}
                />
              )}

              <Button
                btnType={BtnType.Outlined}
                fullWidth
                onClick={() => {
                  setData((pre) => ({
                    ...pre,
                    isUserInformationDetailsModalOpen: true
                  }));
                }}
                translation-key='user_detail_edit_account'
              >
                {t("user_detail_edit_account")}
              </Button>
              <Button
                btnType={BtnType.Primary}
                fullWidth
                onClick={onHanldeChangePassword}
                translation-key='user_detail_change_password'
              >
                {t("user_detail_change_password")}
              </Button>
            </Box>
            <Box className={classes.userGeneralInfo}>
              <Heading2 translation-key='user_detail'>{t("user_detail")}</Heading2>
              {data.userInfo?.firstName && data.userInfo?.lastName && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_fullname'>{t("common_fullname")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{`${data.userInfo.firstName} ${data.userInfo.lastName}`}</ParagraphBody>
                  </Grid>
                </Grid>
              )}
              {data.userInfo?.email && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle>Email</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      btnType={BtnType.Text}
                      padding='0'
                      width='fit-content'
                      href={`mailto:${data.userInfo?.email}`}
                    >
                      {data.userInfo?.email}
                    </Button>
                  </Grid>
                </Grid>
              )}
              {data.userInfo?.dob && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{format(data.userInfo.dob, "dd-MM-yyyy")}</ParagraphBody>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Container className={classes.rightContainer}>
            <UserRecentActivities />
          </Container>
        </Grid>
      </Grid>
      <UserInformationDetailsDialog
        open={data.isUserInformationDetailsModalOpen}
        handleClose={() => {
          setData((pre) => ({
            ...pre,
            isUserInformationDetailsModalOpen: false
          }));
        }}
        title={t("user_detail_dialog_title")}
        translation-key='user_detail_dialog_title'
      />
      <UserPasswordChangeDialog
        open={data.isUserPasswordChangeModalOpen}
        handleClose={() => {
          setData((pre) => ({
            ...pre,
            isUserPasswordChangeModalOpen: false
          }));
        }}
        title={t("user_detail_change_password")}
        cancelText={t("common_back")}
        confirmText={t("user_detail_change_password")}
        onHandleCancel={() => {
          setData((pre) => ({
            ...pre,
            isUserPasswordChangeModalOpen: false
          }));
        }}
        onHanldeConfirm={() => {
          setData((pre) => ({
            ...pre,
            isUserPasswordChangeModalOpen: false
          }));
        }}
        translation-key={[
          "user_detail_change_password",
          "common_back",
          "user_detail_change_password"
        ]}
      />
    </Grid>
  );
};

export default UserInformation;
