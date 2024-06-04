import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { EFetchingUser, selectCurrentUser, selectFetchingStatus } from "reduxes/Auth";
import { routes } from "routes/routes";

import { ERoleName } from "models/authService/entity/role";
import { User } from "models/authService/entity/user";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";

interface PropsData {
  availableRoles: ERoleName[];
}

const RequireAuth = (props: PropsData) => {
  const loggedUser: User = useSelector(selectCurrentUser);
  const isFetchingUser: EFetchingUser = useSelector(selectFetchingStatus);
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const [logginStatus, setLogginStatus] = useState<EFetchingUser | null>(null);
  useEffect(() => {
    const isMatchedRoles = () => {
      if (isFetchingUser === EFetchingUser.PENDING || isFetchingUser === null) {
        setLogginStatus(isFetchingUser);
      }
      if (isFetchingUser === EFetchingUser.FAILED && !loggedUser?.roles) {
        setLogginStatus(EFetchingUser.FAILED);
      }
      if (isFetchingUser === EFetchingUser.SUCCESS && loggedUser && loggedUser?.roles) {
        loggedUser?.roles.some((role) => {
          if (props.availableRoles.includes(role?.name)) {
            setLogginStatus(EFetchingUser.SUCCESS);
            return true;
          }
          setLogginStatus(EFetchingUser.FAILED);
          return false;
        });
      }
    };
    isMatchedRoles();
  }, [isFetchingUser, loggedUser, props.availableRoles]);

  return logginStatus === EFetchingUser.PENDING || logginStatus === null ? (
    <LoadingScreen />
  ) : logginStatus === EFetchingUser.SUCCESS ? (
    <Outlet />
  ) : !accessToken || !refreshToken ? (
    <Navigate to={routes.user.login.root} state={{ from: location }} replace />
  ) : (
    <Navigate to={routes.general.forbidden} state={{ from: location }} replace />
  );
};

export default RequireAuth;
