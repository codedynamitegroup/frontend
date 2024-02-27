import notFoundError from "assets/img/img_notFoundError.png";
import unAuthorized from "assets/img/img_unAuthorized.png";
import courseAssignment from "assets/img/icon/course/courseDetail/assignment.svg";
import courseFile from "assets/img/icon/course/courseDetail/file.svg";
import moodleLogo from "assets/img/logo/moodle_logo.png";
import microsoftLogo from "assets/img/logo/microsoft_logo.png";
import mailboxEmpty from "assets/img/mailbox_empty.svg";

const images = {
  auth: { notFoundError, unAuthorized },
  course: { courseAssignment, courseFile },
  logo: { moodleLogo, microsoftLogo },
  null: { mailboxEmpty }
};

export default images;
