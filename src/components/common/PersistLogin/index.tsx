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
  EFetchingUser
} from "reduxes/Auth";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { UserService } from "services/authService/UserService";

const PersistLogin = () => {
  const selectedUser = useSelector(selectCurrentUser);
  const selectedLoginStatus = useSelector(selectLoginStatus);
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
      if (selectedLoginStatus && accessToken && refreshToken && selectedUser) {
        return;
      }
      if (!accessToken || !refreshToken) {
        dispatch(fetchStatus(EFetchingUser.FAILED));
        return;
      }
      const isExpired: boolean = isTokenExpired(accessToken);

      if (!isExpired) {
        dispatch(setLoading(true));
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
            dispatch(setLoading(false));
          });
      } else {
        try {
          dispatch(setLoading(true));
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
              dispatch(setLoading(false));
            });
        } catch (error) {
          console.error("Error refreshing token", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("provider");
          dispatch(logOut());
          dispatch(setLoading(false));
          navigate(routes.user.login.root);
        }
      }
    };
    getUser();
  }, [dispatch, refreshToken, selectedUser, accessToken, selectedLoginStatus, navigate]);

  return <Outlet />;
};

export default PersistLogin;
