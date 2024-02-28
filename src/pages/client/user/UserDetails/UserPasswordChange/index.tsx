import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Header from "components/Header";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextField from "components/common/inputs/InputTextField";
import Heading1 from "components/text/Heading1";
import TextTitle from "components/text/TextTitle";
import { useState } from "react";
import classes from "./styles.module.scss";

const UserPasswordChange = () => {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    reNewPassword: ""
  });

  return (
    <Grid className={classes.root}>
      <Header />
      <Grid container direction='row' justifyContent={"center"} gap={3}>
        <Box component='form' className={classes.leftContainer} autoComplete='off'>
          <Box className={classes.leftBody}>
            <Heading1
              sx={{
                textAlign: "center"
              }}
            >
              Đổi mật khẩu
            </Heading1>
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12}>
                <TextTitle>Mật khẩu cũ</TextTitle>
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  type='password'
                  value={data.oldPassword}
                  onChange={(e) => {
                    setData((pre) => ({
                      ...pre,
                      oldPassword: e.target.value
                    }));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12}>
                <TextTitle>Mật khẩu mới</TextTitle>
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  type='password'
                  value={data.newPassword}
                  onChange={(e) => {
                    setData((pre) => ({
                      ...pre,
                      newPassword: e.target.value
                    }));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} columns={12}>
              <Grid item xs={12}>
                <TextTitle>Nhập lại mật khẩu mới</TextTitle>
              </Grid>
              <Grid item xs={12}>
                <InputTextField
                  type='password'
                  value={data.reNewPassword}
                  onChange={(e) => {
                    setData((pre) => ({
                      ...pre,
                      reNewPassword: e.target.value
                    }));
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 40px"
            }}
          >
            <Button btnType={BtnType.Primary} onClick={() => {}}>
              Đổi mật khẩu
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserPasswordChange;
