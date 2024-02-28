import { Avatar, Skeleton } from "@mui/material";
import TextTitle from "components/text/TextTitle";
import classes from "./styles.module.scss";

interface UserAvatarAndNameProps {
  loading?: boolean;
  avatarUrl?: string;
}

const UserAvatarAndName = (props: UserAvatarAndNameProps) => {
  const { loading = false } = props;

  return (
    <>
      {loading ? (
        <Skeleton animation='wave' variant='circular' width={"150px"} height={"150px"} />
      ) : (
        <Avatar
          sx={{ width: 150, height: 150 }}
          variant='circular'
          src={props.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
        />
      )}
      <TextTitle className={classes.userFullName}>
        {loading ? (
          <Skeleton animation='wave' width={"200px"} height={"30px"} />
        ) : (
          "Nguyễn Đinh Quang Khánh"
        )}
      </TextTitle>
    </>
  );
};

export default UserAvatarAndName;
