import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser } from "reduxes/Auth";
import { routes } from "routes/routes";

import { ERoleName } from "models/authService/entity/role";
import { User } from "models/authService/entity/user";

interface PropsData {
  availableRoles: ERoleName[];
}

const RequireAuth = (props: PropsData) => {
  const accessToken = localStorage.getItem("accessToken");
  const loggedUser: User = useSelector(selectCurrentUser);
  const location = useLocation();
  const isMatchedRoles = (): Boolean => {
    if (!loggedUser) {
      return false;
    }
    return loggedUser.roles.some((role) => props.availableRoles.includes(role.name));
  };

  return isMatchedRoles() ? (
    <Outlet />
  ) : accessToken ? (
    <Navigate to={routes.general.forbidden} state={{ from: location }} replace />
  ) : (
    <Navigate to={routes.user.login.root} state={{ from: location }} replace />
  );
};

export default RequireAuth;
