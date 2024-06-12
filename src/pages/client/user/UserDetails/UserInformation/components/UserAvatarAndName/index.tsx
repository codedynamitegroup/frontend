import { Avatar, Skeleton } from "@mui/material";
import TextTitle from "components/text/TextTitle";
import classes from "./styles.module.scss";
import images from "config/images";

interface UserAvatarAndNameProps {
  avatarUrl?: string;
  displayName?: string;
}

const UserAvatarAndName = (props: UserAvatarAndNameProps) => {
  const { displayName } = props;
  return (
    <>
      <Avatar
        sx={{ bgcolor: "var(--green-500)", width: 150, height: 150, fontSize: "60px" }}
        alt={displayName}
        src={props.avatarUrl}
      >
        {displayName?.charAt(0)}
      </Avatar>
      <TextTitle className={classes.userFullName}>{displayName}</TextTitle>
    </>
  );
};

export default UserAvatarAndName;
