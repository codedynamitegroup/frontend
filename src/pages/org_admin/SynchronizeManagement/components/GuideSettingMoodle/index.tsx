import React from "react";
import { Container, Box, Typography, Grid, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import classes from "./styles.module.scss";
import images from "config/images";
import Section from "./components/Section";

interface Content {
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

interface Step {
  title: string;
  contents: Content[];
}

const stepsData: Step[] = [
  {
    title: "Đăng nhập vào moodle",
    contents: [
      {
        description:
          "Đầu tiên, bạn cần đăng nhập vào hệ thống Moodle của mình. Sử dụng tài khoản quản trị viên để có quyền truy cập đầy đủ vào các cài đặt hệ thống",
        imageSrc: images.org_admin.guide.step1,
        imageAlt: "Đăng nhập vào Moodle"
      }
    ]
  },
  {
    title: "Enable Web Services",
    contents: [
      {
        description:
          "Vào Site administration (Quản trị trang), sau đó chọn Advanced features (Tính năng nâng cao).",
        imageSrc: images.org_admin.guide.step2.step2_1,
        imageAlt: "Advanced features"
      },
      {
        description:
          "Kích hoạt Enable web services (Bật dịch vụ web) bằng cách đánh dấu vào ô kiểm tương ứng.",
        imageSrc: images.org_admin.guide.step2.step2_2,
        imageAlt: "Enable web services"
      },
      {
        description: "Nhấn Save changes (Lưu thay đổi).",
        imageSrc: images.org_admin.guide.step2.step2_3,
        imageAlt: "Save changes"
      }
    ]
  },
  {
    title: "Enable Protocols",
    contents: [
      {
        description:
          "Trong phần Site administration, chọn Server hoặc Plugins (tùy theo version của moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description:
          "Ở phần Web services (Dịch vụ web), chọn Manage protocols (Quản lý các giao thức).",
        imageSrc: images.org_admin.guide.step3.step3_2,
        imageAlt: "Web services"
      },
      {
        description:
          "Kích hoạt các giao thức cần thiết (ví dụ: REST, SOAP, XML-RPC) bằng cách đánh dấu vào ô kiểm tương ứng.",
        imageSrc: images.org_admin.guide.step3.step3_3,
        imageAlt: "Enable protocols"
      }
    ]
  },
  {
    title: "Create Web Service",
    contents: [
      {
        description:
          "Trong phần Site administration, chọn Server hoặc Plugins (tùy theo version của moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description: "Ở Web services, chọn External services (Dịch vụ bên ngoài).",
        imageSrc: images.org_admin.guide.step4.step4_1,
        imageAlt: "Web services"
      },
      {
        description: "Nhấn vào Add (Thêm).",
        imageSrc: images.org_admin.guide.step4.step4_2,
        imageAlt: "Add"
      },
      {
        description:
          "Điền thông tin cần thiết cho dịch vụ web mới: Tên, Mô tả, Đánh dấu vào ô Enabled (Bật).",
        imageSrc: images.org_admin.guide.step4.step4_3,
        imageAlt: "Web service details"
      },
      {
        description: "Nhấn vào nút Add functions",
        imageSrc: images.org_admin.guide.step4.step4_4,
        imageAlt: "Select protocols"
      },
      {
        description: (
          <>
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
              <Typography variant='h6'>Chọn các hàm cần thiết cho dịch vụ web mới:</Typography>
            </Box>
            <pre className={classes.functionList}>
              core_course_get_courses
              <br />
              mod_quiz_get_quizzes_by_courses
              <br />
              mod_assign_get_assignments
              <br />
              mod_assign_get_user_mappings
              <br />
              mod_assign_get_submission_status
              <br />
              core_enrol_get_enrolled_users
              <br />
              core_course_get_contents
              <br />
              core_course_get_categories
              <br />
              mod_assign_get_submissions
              <br />
              mod_assign_get_grades
              <br />
              core_user_get_course_user_profiles
              <br />
              core_enrol_get_users_courses
              <br />
              core_course_get_course_module
              <br />
              core_user_get_users
            </pre>
            <br />
            sau đó nhấn Save changes (Lưu thay đổi).
          </>
        ),
        imageSrc: images.org_admin.guide.step4.step4_5,
        imageAlt: "Select functions"
      }
    ]
  },
  {
    title: "Create a Token",
    contents: [
      {
        description:
          "Trong phần Site administration, chọn Server hoặc Plugins (tùy theo version của moodle)",
        imageSrc: images.org_admin.guide.step3.step3_1,
        imageAlt: "Plugins"
      },
      {
        description: "Ở Web services, chọn Manage tokens (Quản lý token).",
        imageSrc: images.org_admin.guide.step5.step5_1,
        imageAlt: "Web services"
      },
      {
        description: "Nhấn vào Add (Thêm).",
        imageSrc: images.org_admin.guide.step5.step5_2,
        imageAlt: "Add"
      },
      {
        description:
          "Điền thông tin cần thiết để tạo token: Người dùng, Dịch vụ. Cuối cùng nhấn Save changes (Lưu thay đổi).",
        imageSrc: images.org_admin.guide.step5.step5_3,
        imageAlt: "Token details"
      }
    ]
  }
];

const GuideSettingMoodle: React.FC = () => {
  return (
    <Grid className={classes.root}>
      <Container>
        <Box className={classes.logo}>
          <img
            src={images.org_admin.synchronizeMoodle}
            alt='Synchronize logo'
            className={classes.logoImg}
          />
        </Box>
        <Typography className={classes.title}>Đồng bộ dữ liệu</Typography>
        <Typography className={classes.subtitle}>Hướng dẫn thiết lập moodle</Typography>
      </Container>

      {stepsData.map((step, index) => (
        <Section key={index} number={index + 1} title={step.title} contents={step.contents} />
      ))}
    </Grid>
  );
};

export default GuideSettingMoodle;
