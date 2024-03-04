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

const UserInformation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    isUserInformationDetailsModalOpen: false,
    isUserPasswordChangeModalOpen: false,
    userInfo: {
      id: "0",
      name: "Nguyễn Đinh Quang Khánh",
      gender: "0",
      email: "khanhndq2002@gmail.com",
      dob: "30/06/2002",
      avatar_url:
        "https://icdn.dantri.com.vn/thumb_w/680/2023/06/25/34855533210416990734836827386162909364813774n-edited-1687683216865.jpeg"
    }
  });

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
          sx={{
            height: "100%",
            marginTop: `${headerHeight + 20}px`
          }}
        >
          <Grid item xs={3}>
            <Box className={classes.leftContainer}>
              <Box className={classes.leftBody}>
                <Heading1
                  sx={{
                    textAlign: "center"
                  }}
                >
                  Quản lý tài khoản
                </Heading1>
                <UserAvatarAndName loading={isLoading} avatarUrl={data.userInfo.avatar_url} />
                <Button
                  btnType={BtnType.Outlined}
                  fullWidth
                  onClick={() => {
                    setData((pre) => ({
                      ...pre,
                      isUserInformationDetailsModalOpen: true
                    }));
                  }}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </Box>
              <Box className={classes.userGeneralInfo}>
                <Heading2>Chi tiết người dùng</Heading2>
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle>Họ tên</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    {data.userInfo.name}
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
                    <TextTitle>Ngày sinh</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    {data.userInfo.dob}
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
        title='Chỉnh sửa thông tin cá nhân'
        onHanldeChangePassword={() => {
          setData((pre) => ({
            ...pre,
            isUserInformationDetailsModalOpen: false,
            isUserPasswordChangeModalOpen: true
          }));
        }}
      />
      <UserPasswordChangeDialog
        open={data.isUserPasswordChangeModalOpen}
        handleClose={() => {
          setData((pre) => ({
            ...pre,
            isUserPasswordChangeModalOpen: false
          }));
        }}
        title='Đổi mật khẩu'
        cancelText='Quay lại'
        confirmText='Đổi mật khẩu'
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
      />
    </Box>
  );
};

export default UserInformation;
