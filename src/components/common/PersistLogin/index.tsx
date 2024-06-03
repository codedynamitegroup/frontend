import { userCancelled } from "@azure/msal-browser/dist/error/BrowserAuthErrorCodes";
import { jwtDecode } from "jwt-decode";
import { User } from "models/authService/entity/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { setLogin, selectCurrentUser, selectLoginStatus, loginStatus } from "reduxes/Auth";
import { UserService } from "services/authService/UserService";

const PersistLogin = () => {
  const selectedUser = useSelector(selectCurrentUser);
  const selectedLoginStatus = useSelector(selectLoginStatus);
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const dispatch = useDispatch();
  console.log("accessToken", accessToken);

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
      if (selectedLoginStatus && accessToken && refreshToken && selectedUser) {
        return;
      }
      if (!accessToken || !refreshToken) {
        return;
      }
      const isExpired: boolean = isTokenExpired(accessToken);
      const decodedToken: any = jwtDecode(accessToken);

      if (!isExpired) {
        UserService.getUserByEmail(decodedToken.email)
          .then((response) => {
            const user: User = response;
            dispatch(setLogin({ user: user }));
            dispatch(loginStatus(true));
          })
          .catch((error) => {
            console.error("Failed to get user by email", error);
          });
      } else {
        const refreshTokenResponse = await UserService.refreshToken(accessToken, refreshToken);
        localStorage.setItem("access_token", refreshTokenResponse.accessToken);
        localStorage.setItem("refresh_token", refreshTokenResponse.refreshToken);

        const newDecodedToken: any = jwtDecode(refreshTokenResponse.accessToken);
        UserService.getUserByEmail(newDecodedToken.email)
          .then((response) => {
            const user: User = response;
            dispatch(setLogin({ user: user }));
            dispatch(loginStatus(true));
          })
          .catch((error) => {
            console.error("Failed to get user by email", error);
          });
      }
    };
    getUser();
  }, [dispatch, refreshToken, selectedUser, accessToken, selectedLoginStatus]);

  return <>{<Outlet />} </>;
};

export default PersistLogin;
