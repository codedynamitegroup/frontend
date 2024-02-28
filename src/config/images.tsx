import notFoundError from "assets/img/img_notFoundError.png";
import unAuthorized from "assets/img/img_unAuthorized.png";
import courseAssignment from "assets/img/icon/course/courseDetail/assignment.svg";
import courseFile from "assets/img/icon/course/courseDetail/file.svg";
import moodleLogo from "assets/img/logo/moodle_logo.png";
import microsoftLogo from "assets/img/logo/microsoft_logo.png";
import mailboxEmpty from "assets/img/mailbox_empty.svg";
import icLevel from "assets/img/icon/skill-level-advanced.svg";
import googleLogo from "assets/img/logo/google_logo.svg";
import login from "assets/img/login.png";
import forgotpassword from "assets/img/forgotpassword.png";
import contestListBackground from "assets/img/background/contest-list-background.png";
import changePasswordThumbnail from "assets/img/change_password_thumbnail.svg";
import courseCertificatesBackground from "assets/img/background/background-course-certificate.jpg";
import icCertificate from "assets/img/icon/certificate-quality-award-education-medal.svg";

const images = {
  auth: { notFoundError, unAuthorized },
  course: { courseAssignment, courseFile },
  background: { contestListBackground, courseCertificatesBackground },
  logo: { moodleLogo, microsoftLogo, googleLogo },
  null: { mailboxEmpty },
  login,
  forgotpassword,
  icLevel,
  contestListBackground,
  changePasswordThumbnail,
  icCertificate
};

export default images;
