import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Footer from "components/Footer";
import Header from "components/Header";
import { Route, Routes } from "react-router";
import CourseCertificates from "./CourseCertificate";
import HomePage from "./HomePage";
import UserDashboard from "./Dashboard";
import ListProblem from "./ListProblem";
import ContestList from "./Contest/ContestList";
import Login from "./Login";
import Register from "./Register";
import UserInformation from "./UserDetails/UserInformation";
import VerifyOTP from "./ForgotPassword/components/VerifyOTP";
import ForbiddenPage from "pages/common/ForbiddenPage";
import NotFoundPage from "pages/common/NotFoundPage";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import BusinessContact from "./BusinessContact";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { lazy } from "react";
import UserProfile from "./UserProfile";
const CourseCertificateDetail = lazy(() => import("./CourseCertificate/Detail"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ResetPassword = lazy(() => import("./ForgotPassword/components/ResetPassword"));
const ContestDetails = lazy(() => import("./Contest/ContestDetails"));

type Props = {};

const UserHomepage = (props: Props) => {
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  return (
    <Grid id={classes.userPageRoot}>
      <Header />
      <main
        id={classes.userPageMain}
        style={{
          marginTop: `${sidebarStatus.headerHeight}px`,
          height: `calc(100% - ${sidebarStatus.headerHeight}px)`
        }}
      >
        <Routes>
          <Route path={""} element={<HomePage />} />
          <Route path={"certificate-courses"} element={<CourseCertificates />} />
          <Route path={"certificate-courses/:courseId/*"} element={<CourseCertificateDetail />} />
          <Route path={"problems"} element={<ListProblem />} />
          <Route path={"contests"} element={<ContestList />} />
          <Route path={"contests/:contestId/*"} element={<ContestDetails />} />
          <Route path={"login"} element={<Login />} />
          <Route path={"register"} element={<Register />} />
          <Route path={"organization"} element={<BusinessContact />} />
          <Route path={"forgot-password"} element={<ForgotPassword />} />
          <Route path={"forgot-password/verify-otp"} element={<VerifyOTP />} />
          <Route path={"forgot-password/reset-password"} element={<ResetPassword />} />
          <Route path={"home"} element={<UserDashboard />} />
          <Route element={<RequireAuth availableRoles={[ERoleName.USER]} />}>
            <Route path={"user/information"} element={<UserInformation />} />
            <Route path={"user/profile/:userId"} element={<UserProfile />} />
          </Route>
          <Route path={"forbidden"} element={<ForbiddenPage />} />
          <Route path={"*"} element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Grid>
  );
};

export default UserHomepage;
