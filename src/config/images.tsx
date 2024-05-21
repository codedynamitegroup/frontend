import notFoundError from "assets/img/img_notFoundError.png";
import unAuthorized from "assets/img/img_unAuthorized.png";
import courseAssignment from "assets/img/icon/course/courseDetail/assignment.svg";
import courseFile from "assets/img/icon/course/courseDetail/file.svg";
import courseUrl from "assets/img/icon/course/courseDetail/url.svg";
import courseImage from "assets/img/icon/course/courseDetail/image.svg";
import coursePDF from "assets/img/icon/course/courseDetail/pdf.svg";
import courseDOC from "assets/img/icon/course/courseDetail/doc.svg";
import courseXLS from "assets/img/icon/course/courseDetail/xls.svg";
import coursePPT from "assets/img/icon/course/courseDetail/ppt.svg";
import moodleLogo from "assets/img/logo/moodle_logo.png";
import microsoftLogo from "assets/img/logo/microsoft_logo.png";
import mailboxEmpty from "assets/img/mailbox_empty.svg";
import icLevel from "assets/img/icon/skill-level-advanced.svg";
import googleLogo from "assets/img/logo/google_logo.svg";
import logo from "assets/img/logo/logo.svg";
import login from "assets/img/login.png";
import forgotpassword from "assets/img/forgotpassword.png";
import contestListBackground from "assets/img/background/contest-list-background.png";
import contestTimeBackground from "assets/img/background/contest-time-background.png";
import changePasswordThumbnail from "assets/img/change_password_thumbnail.svg";
import courseCertificatesBackground from "assets/img/background/background-course-certificate.jpg";
import homePageBackground from "assets/img/background/background-homepage.png";
import icCertificate from "assets/img/icon/certificate-quality-award-education-medal.svg";
import home from "assets/img/home.png";

import deadlineIcon from "assets/img/icon/notification/deadline-svgrepo-com.svg";
import contestIcon from "assets/img/icon/notification/trophy-on-daily-calendar-page-interface-symbol-of-the-contest-day-svgrepo-com.svg";
import examIcon from "assets/img/icon/notification/exam-svgrepo-com.svg";
import homeworkIcon from "assets/img/icon/notification/homework-svgrepo-com.svg";
import syncIcon from "assets/img/icon/notification/sync-svgrepo-com.svg";

import tempContest1 from "assets/img/temp/contest/1.png";
import tempContest2 from "assets/img/temp/contest/2.png";
import tempContest3 from "assets/img/temp/contest/3.png";
import tempContest4 from "assets/img/temp/contest/4.png";
import tempContest5 from "assets/img/temp/contest/5.png";

import flagVietnam from "assets/img/icon/flag/flag-vietnam.svg";
import flagUs from "assets/img/icon/flag/flag-us.svg";
import icAlmostEqualTo from "assets/img/icon/almost_equal_to_icon.svg";

const images = {
  auth: { notFoundError, unAuthorized },
  course: {
    courseAssignment,
    courseFile,
    courseUrl,
    courseImage,
    coursePDF,
    courseDOC,
    courseXLS,
    coursePPT
  },
  background: { contestListBackground, courseCertificatesBackground, homePageBackground },
  logo: { moodleLogo, microsoftLogo, googleLogo, logo },
  null: { mailboxEmpty },
  login,
  home,
  forgotpassword,
  icLevel,
  contestListBackground,
  changePasswordThumbnail,
  icCertificate,
  contestTimeBackground,
  temp: { contest: { tempContest1, tempContest2, tempContest3, tempContest4, tempContest5 } },
  flagIcon: { flagVietnam, flagUs },
  icAlmostEqualTo
};
const notificaionIcon = { deadlineIcon, contestIcon, examIcon, homeworkIcon, syncIcon };
export { notificaionIcon };
export default images;
