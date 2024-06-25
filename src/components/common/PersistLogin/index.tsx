import { jwtDecode } from "jwt-decode";
import { User } from "models/authService/entity/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  setLogin,
  selectCurrentUser,
  selectLoginStatus,
  loginStatus,
  fetchStatus,
  EFetchingUser,
  selectFetchingStatus
} from "reduxes/Auth";
import { setLoadingAuth } from "reduxes/Loading";
import { routes } from "routes/routes";
import { UserService } from "services/authService/UserService";

const PersistLogin = () => {
  const selectedUser = useSelector(selectCurrentUser);
  const selectedLoginStatus = useSelector(selectLoginStatus);
  const selectedFetchingStatus = useSelector(selectFetchingStatus);
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      if (
        selectedFetchingStatus === EFetchingUser.SUCCESS ||
        selectedFetchingStatus === EFetchingUser.FAILED
      ) {
        return;
      }
      if (selectedLoginStatus && accessToken && refreshToken && selectedUser) {
        return;
      }
      if (!accessToken || !refreshToken) {
        dispatch(fetchStatus(EFetchingUser.FAILED));
        return;
      }

      UserService.getUserByEmail()
        .then((response) => {
          const user: User = response;
          dispatch(setLogin({ user: user }));
          dispatch(loginStatus(true));
        })
        .catch((error) => {
          console.error("Failed to get user by email", error);
          dispatch(fetchStatus(EFetchingUser.FAILED));
          navigate(routes.user.homepage.root);
        })
        .finally(() => {
          dispatch(setLoadingAuth(false));
        });
    };
    getUser();
  }, [
    dispatch,
    refreshToken,
    selectedUser,
    accessToken,
    selectedLoginStatus,
    navigate,
    selectedFetchingStatus
  ]);

  return <Outlet />;
};

export default PersistLogin;
