import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Header from "components/Header";
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
        "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90"
    }
  });

  // fake loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
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
      <Grid className={classes.root}>
        <Header />
        <Grid
          container
          direction='row'
          justifyContent={"center"}
          gap={3}
          sx={{
            height: "100%"
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
    </>
  );
};

export default UserInformation;
