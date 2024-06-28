import { ERoleName } from "models/authService/entity/role";
import { User } from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { selectCurrentUser, selectLoginStatus } from "reduxes/Auth";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { UserService } from "services/authService/UserService";

export default function useAuth() {
  const loggedUser: User = useSelector(selectCurrentUser);
  const isBelongToOrganization =
    loggedUser &&
    loggedUser?.organization !== null &&
    loggedUser?.organization.isVerified === true &&
    loggedUser?.organization.isDeleted === false;
  const loginStatus: Boolean = useSelector(selectLoginStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    if (!loggedUser) return;
    dispatch(setLoading(true));
    UserService.logout(loggedUser.email)
      .then(() => {})
      .catch((error) => {
        console.error("Failed to logout", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        const provider = localStorage.getItem("provider");
        if (provider === ESocialLoginProvider.MICROSOFT) {
          sessionStorage.clear();
        }
        localStorage.removeItem("provider");
        navigate(routes.user.homepage.root);
        navigate(0);
        dispatch(setLoading(false));
      });
  };
  return {
    loggedUser: loggedUser,
    isLoggedIn: loginStatus,
    logout: logout,
    isGuest: !loginStatus,
    isBelongToOrganization: isBelongToOrganization,
    isLecturer:
      loggedUser?.roles.some((role) => role.name === ERoleName.LECTURER_MOODLE) &&
      isBelongToOrganization,
    isStudent:
      loggedUser?.roles.some((role) => role.name === ERoleName.STUDENT_MOODLE) &&
      isBelongToOrganization,
    isSystemAdmin: loggedUser?.roles.some((role) => role.name === ERoleName.ADMIN),
    isMoodleAdmin:
      loggedUser?.roles.some((role) => role.name === ERoleName.ADMIN_MOODLE) &&
      isBelongToOrganization
  };
}
