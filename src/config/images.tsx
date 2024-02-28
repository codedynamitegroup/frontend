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

const images = {
  auth: { notFoundError, unAuthorized },
  course: { courseAssignment, courseFile },
  logo: { moodleLogo, microsoftLogo, googleLogo },
  null: { mailboxEmpty },
  login,
  forgotpassword,
  icLevel,
  contestListBackground
};

export default images;
