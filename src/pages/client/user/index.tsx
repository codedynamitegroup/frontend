import { Box, Grid } from "@mui/material";
import { useRef } from "react";
import classes from "./styles.module.scss";
import Footer from "components/Footer";
import Header from "components/Header";
import useBoxDimensions from "hooks/useBoxDimensions";
import { Route, Routes } from "react-router";
import CourseCertificates from "./CourseCertificate";
import HomePage from "./HomePage";
import UserDashboard from "./Dashboard";
import ListProblem from "./ListProblem";
import ContestList from "./Contest/ContestList";
import CourseCertificateDetail from "./CourseCertificate/Detail";
import ContestDetails from "./Contest/ContestDetails";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import UserInformation from "./UserDetails/UserInformation";
import VerifyOTP from "./ForgotPassword/components/VerifyOTP";
import ResetPassword from "./ForgotPassword/components/ResetPassword";
import ForbiddenPage from "pages/common/ForbiddenPage";
import NotFoundPage from "pages/common/NotFoundPage";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import BusinessContact from "./BusinessContact";

type Props = {};

const UserHomepage = (props: Props) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { height: headerHeight } = useBoxDimensions({
    ref: headerRef
  });

  return (
    <Grid id={classes.userPageRoot}>
      <Header ref={headerRef} />
      <main
        id={classes.userPageMain}
        style={{
          marginTop: `${headerHeight}px`,
          height: `calc(100% - ${headerHeight}px)`,
          overflow: "auto"
        }}
      >
        <Box id={classes.userPageBody}>
          <Routes>
            <Route path={""} element={<HomePage />} />
            <Route path={"certificate-courses"} element={<CourseCertificates />} />
            <Route path={"certificate-courses/:courseId/*"} element={<CourseCertificateDetail />} />
            <Route path={"problems"} element={<ListProblem />} />
            <Route path={"contests"} element={<ContestList />} />
            <Route path={"contests/:contestId/*"} element={<ContestDetails />} />
            <Route path={"login"} element={<Login />} />
            <Route path={"register"} element={<Register />} />
            <Route path={"business-contact"} element={<BusinessContact />} />
            <Route path={"forgot-password"} element={<ForgotPassword />} />
            <Route path={"forgot-password/verify-otp"} element={<VerifyOTP />} />
            <Route path={"forgot-password/reset-password"} element={<ResetPassword />} />
            <Route path={"home"} element={<UserDashboard />} />
            <Route element={<RequireAuth availableRoles={[ERoleName.USER]} />}>
              <Route path={"user/information"} element={<UserInformation />} />
            </Route>
            <Route path={"forbidden"} element={<ForbiddenPage />} />
            <Route path={"*"} element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </main>
    </Grid>
  );
};

export default UserHomepage;
