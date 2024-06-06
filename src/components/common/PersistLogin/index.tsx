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
  logOut,
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

  const isTokenExpired = (token: string) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

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
      const isExpired: boolean = isTokenExpired(accessToken);

      if (!isExpired) {
        dispatch(setLoadingAuth(true));
        UserService.getUserByEmail()
          .then((response) => {
            const user: User = response;
            dispatch(setLogin({ user: user }));
            dispatch(loginStatus(true));
          })
          .catch((error) => {
            console.error("Failed to get user by email", error);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("provider");
            dispatch(logOut());
            dispatch(fetchStatus(EFetchingUser.FAILED));
            navigate(routes.user.homepage.root);
          })
          .finally(() => {
            dispatch(setLoadingAuth(false));
          });
      } else {
        try {
          dispatch(setLoadingAuth(true));
          const refreshTokenResponse = await UserService.refreshToken(accessToken, refreshToken);
          localStorage.setItem("access_token", refreshTokenResponse.accessToken);
          localStorage.setItem("refresh_token", refreshTokenResponse.refreshToken);

          UserService.getUserByEmail()
            .then((response) => {
              const user: User = response;
              dispatch(setLogin({ user: user }));
              dispatch(loginStatus(true));
            })
            .catch((error) => {
              console.error("Failed to get user by email", error);
              dispatch(fetchStatus(EFetchingUser.FAILED));
            })
            .finally(() => {
              dispatch(setLoadingAuth(false));
            });
        } catch (error) {
          console.error("Error refreshing token", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("provider");
          dispatch(logOut());
          dispatch(setLoadingAuth(false));
          dispatch(fetchStatus(EFetchingUser.FAILED));
          navigate(routes.user.homepage.root);
        }
      }
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
