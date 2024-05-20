import { Avatar, Skeleton } from "@mui/material";
import TextTitle from "components/text/TextTitle";
import classes from "./styles.module.scss";
import images from "config/images";

interface UserAvatarAndNameProps {
  loading?: boolean;
  avatarUrl?: string;
  displayName?: string;
}

const UserAvatarAndName = (props: UserAvatarAndNameProps) => {
  const { loading = false, displayName } = props;
  return (
    <>
      {loading ? (
        <Skeleton animation='wave' variant='circular' width={"150px"} height={"150px"} />
      ) : (
        <Avatar
          sx={{ width: 150, height: 150 }}
          variant='circular'
          src={props.avatarUrl ? props.avatarUrl : images.avatar.avatarBoyDefault}
        />
      )}
      {displayName && (
        <TextTitle className={classes.userFullName}>
          {loading ? <Skeleton animation='wave' width={"200px"} height={"30px"} /> : displayName}
        </TextTitle>
      )}
    </>
  );
};

export default UserAvatarAndName;
