import classes from "./styles.module.scss";
import { Avatar } from "@files-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import JoyButton from "@mui/joy/Button";
import { uploadToCloudinary } from "utils/uploadToCloudinary";
import { UpdateProfileAvatarRequest, User } from "models/authService/entity/user";
import useAuth from "hooks/useAuth";
import { UserService } from "services/authService/UserService";
import { useTranslation } from "react-i18next";
import { setLogin } from "reduxes/Auth";
interface UserAvatarAndNameProps {
  avatarUrl?: string;
}

const UserAvatarAndName = (props: UserAvatarAndNameProps) => {
  const [uploadAvatar, setUploadAvatar] = useState<File | undefined | string>(props?.avatarUrl);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { loggedUser } = useAuth();
  const { t } = useTranslation();
  const onSaveAvatar = async () => {
    if (!uploadAvatar || !loggedUser || typeof uploadAvatar === "string") {
      dispatch(setErrorMess("You haven't chosen any image yet"));
      return;
    }
    setIsLoading(true);
    try {
      const url = await uploadToCloudinary(uploadAvatar);
      const updateProfileAvatarRequest: UpdateProfileAvatarRequest = {
        avatarUrl: url,
        email: loggedUser.email
      };
      await UserService.updateProfileAvatarUser(updateProfileAvatarRequest)
        .then((res) => {
          dispatch(setSuccessMess("Update avatar successfully"));
          const accessToken = localStorage.getItem("access_token");
          const provider = localStorage.getItem("provider");
          UserService.getUserByEmail()
            .then((response) => {
              const user: User = response;
              dispatch(
                setLogin({ user: user, token: accessToken, provider: provider ? provider : null })
              );
            })
            .catch((error) => {
              console.error("Failed to get user by email", error);
            });
        })
        .catch((error) => {
          dispatch(setSuccessMess("Update avatar failed"));
          console.error("update avatar error", error);
        });
    } catch (error) {
      dispatch(setSuccessMess("Update avatar failed"));
      console.error("upload avatar error", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Avatar
        src={uploadAvatar}
        variant='circle'
        id={classes.avatar}
        onError={(e: any) => {
          dispatch(setErrorMess("Can't load avatar image"));
        }}
        onChange={(imgSource) => setUploadAvatar(imgSource)}
        accept='.jpg, .png, .jpeg'
        emptyLabel={"You can choose an image..."}
        changeLabel={"Do you want to change this amazing picture?"}
        alt='avatar user'
      />
      <JoyButton loading={isLoading} onClick={onSaveAvatar} variant='outlined'>
        {t("user_detail_edit_avatar")}
      </JoyButton>
    </>
  );
};

export default UserAvatarAndName;
