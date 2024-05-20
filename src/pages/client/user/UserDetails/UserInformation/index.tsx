import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Header from "components/Header";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import TextTitle from "components/text/TextTitle";
import { useEffect, useRef, useState } from "react";
import UserAvatarAndName from "./components/UserAvatarAndName";
import UserInformationDetailsDialog from "./components/UserInformationDetailsDialog";
import UserPasswordChangeDialog from "./components/UserPasswordChangeDialog";
import UserRecentActivities from "./components/UserRecentActivities";
import classes from "./styles.module.scss";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "reduxes/Auth";
import { User } from "models/authService/entity/user";
import ParagraphBody from "components/text/ParagraphBody";

const UserInformation = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const user: User = useSelector(selectCurrentUser);

  const [data, setData] = useState({
    isUserInformationDetailsModalOpen: false,
    isUserPasswordChangeModalOpen: false,
    userInfo: {
      id: user?.userId,
      name: user?.firstName + " " + user?.lastName,
      gender: "0",
      email: user?.email,
      dob: "01/01/2000",
      avatar_url: user?.avatarUrl,
      is_linked_with_google: user?.isLinkedWithGoogle,
      is_linked_with_microsoft: user?.isLinkedWithMicrosoft
    }
  });

  useEffect(() => {
    if (user) {
      setData({
        ...data,
        userInfo: {
          ...data.userInfo,
          id: user.userId,
          name: user.firstName + " " + user.lastName,
          email: user.email
        }
      });
    }
  }, [user]);

  // fake loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Box>
      <Grid className={classes.root}>
        <Header ref={headerRef} />
        <Grid
          container
          direction='row'
          justifyContent={"center"}
          gap={3}
          paddingTop={3}
          sx={{
            height: "100%",
            marginTop: `${headerHeight}px`
          }}
        >
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
                <UserAvatarAndName
                  displayName={data.userInfo.name}
                  loading={isLoading}
                  avatarUrl={data.userInfo.avatar_url}
                />
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
              </Box>
              <Box className={classes.userGeneralInfo}>
                <Heading2 translation-key='user_detail'>{t("user_detail")}</Heading2>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_fullname'>{t("common_fullname")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{data.userInfo.name}</ParagraphBody>
                  </Grid>
                </Grid>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle>Email</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      btnType={BtnType.Text}
                      padding='0'
                      width='fit-content'
                      href={`mailto:${data.userInfo.email}`}
                    >
                      {data.userInfo.email}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{data.userInfo.dob}</ParagraphBody>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Container className={classes.rightContainer}>
              <UserRecentActivities />
            </Container>
          </Grid>
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
        initialData={data.userInfo}
        title={t("user_detail_dialog_title")}
        onHanldeChangePassword={() => {
          setData((pre) => ({
            ...pre,
            isUserInformationDetailsModalOpen: false,
            isUserPasswordChangeModalOpen: true
          }));
        }}
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
            isUserPasswordChangeModalOpen: false,
            isUserInformationDetailsModalOpen: true
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
    </Box>
  );
};

export default UserInformation;
