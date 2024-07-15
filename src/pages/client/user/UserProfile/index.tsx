import { Avatar, Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading1 from "components/text/Heading1";
import Heading2 from "components/text/Heading2";
import TextTitle from "components/text/TextTitle";
import { useEffect, useState } from "react";
import UserRecentActivities from "./components/UserRecentActivities";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/text/ParagraphBody";
import { format } from "date-fns";
import { User } from "models/authService/entity/user";
import { useParams } from "react-router-dom";
import { UserService } from "services/authService/UserService";
import { generateHSLColorByRandomText } from "utils/generateColorByText";

const UserProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>();
  const { userId } = useParams<{ userId: string }>();

  const fetchUserById = async (id: string) => {
    await UserService.getUserById(id)
      .then((res) => {
        setUser(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId]);

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
                User Profile
              </Heading1>
              <Avatar
                sx={{
                  bgcolor: `${generateHSLColorByRandomText(`${user?.firstName} ${user?.lastName}`)}`
                }}
                alt={user?.email}
                src={user?.avatarUrl}
                className={classes.avatar}
              >
                <Heading1 colorname='--white' fontSize={"50px"}>
                  {user?.firstName.charAt(0)}
                </Heading1>
              </Avatar>
            </Box>
            <Box className={classes.userGeneralInfo}>
              <Heading2 translation-key='user_detail'>{t("user_detail")}</Heading2>
              {user?.firstName && user?.lastName && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_fullname'>{t("common_fullname")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{`${user.firstName} ${user.lastName}`}</ParagraphBody>
                  </Grid>
                </Grid>
              )}
              {user?.email && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle>{t("common_email")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      btnType={BtnType.Text}
                      padding='0'
                      width='fit-content'
                      href={`mailto:${user?.email}`}
                    >
                      {user?.email}
                    </Button>
                  </Grid>
                </Grid>
              )}
              {user?.dob && (
                <Grid container spacing={1} columns={12}>
                  <Grid item xs={12}>
                    <TextTitle translation-key='common_DOB'>{t("common_DOB")}</TextTitle>
                  </Grid>
                  <Grid item xs={12}>
                    <ParagraphBody>{format(user.dob, "dd-MM-yyyy")}</ParagraphBody>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Container className={classes.rightContainer}>
            <UserRecentActivities user={user} />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
