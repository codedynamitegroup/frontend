import courseAssignment from "assets/img/icon/course/courseDetail/assignment.svg";
import courseFile from "assets/img/icon/course/courseDetail/file.svg";
import courseUrl from "assets/img/icon/course/courseDetail/url.svg";
import courseImage from "assets/img/icon/course/courseDetail/image.svg";
import coursePDF from "assets/img/icon/course/courseDetail/pdf.svg";
import courseDOC from "assets/img/icon/course/courseDetail/doc.svg";
import courseXLS from "assets/img/icon/course/courseDetail/xls.svg";
import coursePPT from "assets/img/icon/course/courseDetail/ppt.svg";
import assignmentIcon from "assets/img/icon/course/courseDetail/assignment/assignment.svg";
import quizIcon from "assets/img/icon/course/courseDetail/quiz.svg";
import moodleLogo from "assets/img/logo/moodle_logo.png";
import microsoftLogo from "assets/img/logo/microsoft_logo.png";
import mailboxEmpty from "assets/img/mailbox_empty.svg";
import icLevel from "assets/img/icon/skill-level-advanced.svg";
import googleLogo from "assets/img/logo/google_logo.svg";
import appLogo from "assets/img/logo/logo.svg";
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

import notFoundError from "assets/img/error/NotFoundError.svg";
import forbiddenError from "assets/img/error/ForbiddenError.svg";

import contest from "assets/img/admin/contest.svg";
import adminManagement from "assets/img/admin/adminManagement.svg";
import onlineUser from "assets/img/admin/online-user.svg";
import offlineUser from "assets/img/admin/offline-user.svg";
import totalUser from "assets/img/admin/total-user.svg";
import loginTodayUser from "assets/img/admin/login-today.svg";
import course from "assets/img/admin/course.svg";
import userEnrollment from "assets/img/admin/enrollment.svg";
import activeCourse from "assets/img/admin/active-course.svg";
import inactiveCourse from "assets/img/admin/inactive-course.svg";
import clientPage from "assets/img/admin/clientPage.svg";

import certificateCompleted from "assets/img/admin/certificate-course-completed-com.svg";
import certificateEnrollment from "assets/img/admin/certificate-course-enrollment.svg";
import certificateRating from "assets/img/admin/certificate-course-rating.svg";
import certificateCourse from "assets/img/admin/certificate-course.svg";

import closedContest from "assets/img/admin/closed-contest.svg";
import contestParticipant from "assets/img/admin/contest-participant.svg";
import happeningContest from "assets/img/admin/happening-contest.svg";
import upcomingContest from "assets/img/admin/upcomming-contest.svg";
import contestDashboard from "assets/img/admin/contest-dashboard.svg";

const images = {
  course: {
    courseAssignment,
    courseFile,
    courseUrl,
    courseImage,
    coursePDF,
    courseDOC,
    courseXLS,
    coursePPT,
    assignmentIcon,
    quizIcon
  },

  background: { contestListBackground, courseCertificatesBackground, homePageBackground },
  logo: { moodleLogo, microsoftLogo, googleLogo, appLogo },
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
  icAlmostEqualTo,
  error: { notFoundError, forbiddenError },
  admin: {
    contest,
    adminManagement,
    onlineUser,
    offlineUser,
    totalUser,
    loginTodayUser,
    course,
    userEnrollment,
    activeCourse,
    inactiveCourse,
    clientPage,
    certificateCompleted,
    certificateEnrollment,
    certificateRating,
    certificateCourse,
    closedContest,
    contestParticipant,
    happeningContest,
    upcomingContest,
    contestDashboard
  }
};
const notificaionIcon = { deadlineIcon, contestIcon, examIcon, homeworkIcon, syncIcon };
export { notificaionIcon };
export default images;
