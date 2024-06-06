import { ERoleName } from "models/authService/entity/role";
import { User } from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { logOut, selectCurrentUser, selectLoginStatus } from "reduxes/Auth";
import { setLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { UserService } from "services/authService/UserService";

export default function useAuth() {
  const loggedUser: User = useSelector(selectCurrentUser);
  const loginStatus: Boolean = useSelector(selectLoginStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    dispatch(setLoading(true));
    UserService.logout()
      .then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        const provider = localStorage.getItem("provider");
        if (provider === ESocialLoginProvider.MICROSOFT) {
          sessionStorage.clear();
        }
        localStorage.removeItem("provider");
        dispatch(logOut());
        dispatch(setSuccessMess("Logout successfully"));
        navigate(routes.user.homepage.root);
      })
      .catch((error) => {
        dispatch(setErrorMess("Failed to logout, please try again later."));
        console.error("Failed to logout", {
          code: error.response?.code || 503,
          status: error.response?.status || "Service Unavailable",
          message: error.response?.message || error.message
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  return {
    loggedUser: loggedUser,
    isLoggedIn: loginStatus,
    logout: logout,
    isGuest: !loginStatus,
    isLecturer: loggedUser?.roles.some((role) => role.name === ERoleName.LECTURER_MOODLE),
    isStudent: loggedUser?.roles.some((role) => role.name === ERoleName.STUDENT_MOODLE),
    isSystemAdmin: loggedUser?.roles.some((role) => role.name === ERoleName.ADMIN),
    isMoodleAdmin: loggedUser?.roles.some((role) => role.name === ERoleName.ADMIN_MOODLE)
  };
}
