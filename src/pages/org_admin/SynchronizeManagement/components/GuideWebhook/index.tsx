import React from "react";
import { Container, Box, Typography, Grid, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import images from "config/images";
import Section from "../GuideSettingMoodle/components/Section";

interface Content {
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

interface Step {
  title: string;
  contents: Content[];
}

export default function GuideWebhook() {
  const stepsData: Step[] = [
    {
      title: "Cài đặt plugin WebHooks",
      contents: [
        {
          description:
            "Đầu tiên, bạn cần vào Site administration và chọn Plugins sau đó chọn Install plugins.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_1,
          imageAlt: "Vào site administraction"
        },
        {
          description:
            "Truy cập thư mục plugin của Moodle và tải xuống plugin WebHooks bằng cách nhấn vào nút Tải xuống.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_2,
          imageAlt: "Tải xuống plugin WebHooks"
        },
        {
          description:
            "Quay lại trang Cài đặt plugin trong Moodle. Chọn Choose a file..., chọn tệp ZIP plugin WebHooks đã tải xuống và nhấn Install plugin from the ZIP file.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_3,
          imageAlt: "Tải lên plugin WebHooks"
        }
      ]
    },
    {
      title: "Tạo dịch vụ WebHook",
      contents: [
        {
          description: "Bạn cần vào Site administration và chọn Server sau đó chọn Webhook",
          imageSrc: images.org_admin.guide.webhook.step1.step1_4,
          imageAlt: "Truy cập vào Cài đặt máy chủ"
        },
        {
          description: "Nhấn vào nút Add service để tạo một dịch vụ WebHook mới.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_5,
          imageAlt: "Thêm dịch vụ WebHook mới"
        },
        {
          description:
            "Nhập Tên và URL của dịch vụ WebHook của bạn. Tên: CodeDynamiteWebhook, URL: https://api.codedynamite.click/course/webhook/receive",
          imageSrc: images.org_admin.guide.webhook.step1.step1_6,
          imageAlt: "Cấu hình dịch vụ bên ngoài"
        },
        {
          description:
            "Chọn các sự kiện bạn muốn WebHook lắng nghe bằng cách đánh dấu vào các ô tương ứng.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_7,
          imageAlt: "Chọn sự kiện cho WebHook"
        },
        {
          description: "Cuộn xuống và nhấn nút Save changes để áp dụng cài đặt của bạn.",
          imageSrc: images.org_admin.guide.webhook.step1.step1_8,
          imageAlt: "Lưu thay đổi"
        }
      ]
    }
  ];

  return (
    <Grid className={classes.root}>
      <Container>
        <Typography className={classes.title}>Hướng dẫn thiết lập webhook</Typography>
      </Container>

      {stepsData.map((step, index) => (
        <Section key={index} number={index + 1} title={step.title} contents={step.contents} />
      ))}
    </Grid>
  );
}
