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
        sx={{ width: 150, height: 150 }}
        variant='circular'
        src={props.avatarUrl ? props.avatarUrl : images.avatar.avatarBoyDefault}
      />
      <TextTitle className={classes.userFullName}>{displayName}</TextTitle>
    </>
  );
};

export default UserAvatarAndName;
