import React from "react";
import SearchBar from "components/common/search/SearchBar";
import classes from "./styles.module.scss";
import Box from "@mui/material/Box";
import Button, { BtnType } from "components/common/buttons/Button";
import { Card, Divider, Grid } from "@mui/material";
import Heading3 from "components/text/Heading3";
import Heading2 from "components/text/Heading2";
import Heading1 from "components/text/Heading1";
import MenuPopup from "components/common/menu/MenuPopup";
import { routes } from "routes/routes";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import dayjs from "dayjs";

const LecturerCourseAssignmentDetails = () => {
  const searchHandle = (searchVal: string) => {
    console.log(searchVal);
  };
  const navigate = useNavigate();
  const assignmentOpenTime = dayjs();
  const assignmentCloseTime = dayjs();
  const assignmentDescriptionRawHTML = `
    <div>
    <p>Đây là mô tả bài tập</p>
    </div>
    `;
  const activityInstructionsRawHTML = `
    <div>
    <p>Đây là hướng dẫn bài tập</p>
    </div>
    `;

  return (
    <Box className={classes.assignmentBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.lecturer.course.assignment);
        }}
        startIcon={
          <ChevronLeftIcon
            sx={{
              color: "white"
            }}
          />
        }
        width='fit-content'
      >
        <ParagraphBody>Quay lại</ParagraphBody>
      </Button>
      <Heading1>Bài tập 1</Heading1>
      <Card
        className={classes.pageActivityHeader}
        sx={{
          padding: "10px",
          backgroundColor: "#F8F9FA"
        }}
      >
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian mở:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {assignmentOpenTime
                ?.toDate()
                .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Grid container direction='row' alignItems='center' gap={1}>
          <Grid item>
            <ParagraphSmall fontWeight={"600"}>Thời gian đóng:</ParagraphSmall>
          </Grid>
          <Grid item>
            <ParagraphBody>
              {assignmentCloseTime
                ?.toDate()
                .toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}
            </ParagraphBody>
          </Grid>
        </Grid>
        <Divider
          style={{
            marginTop: "10px",
            marginBottom: "10px"
          }}
        />
        <Box className={classes.assignmentDescription}>
          <div dangerouslySetInnerHTML={{ __html: assignmentDescriptionRawHTML }}></div>
          <div
            style={{
              marginBottom: "10px"
            }}
            dangerouslySetInnerHTML={{ __html: activityInstructionsRawHTML }}
          ></div>
        </Box>
      </Card>
      <Box
        sx={{
          display: "flex",
          gap: "20px"
        }}
      >
        <Button
          btnType={BtnType.Outlined}
          onClick={() => {
            navigate(routes.lecturer.assignment.submissions);
          }}
        >
          <ParagraphBody>Xem danh sách bài nộp</ParagraphBody>
        </Button>
        <Button
          btnType={BtnType.Primary}
          onClick={() => {
            navigate(routes.lecturer.assignment.grading);
          }}
        >
          <ParagraphBody>Chấm điểm</ParagraphBody>
        </Button>
      </Box>

      <Heading1>
        <ParagraphBody>Tổng quan chấm điểm</ParagraphBody>
      </Heading1>

      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.student.assignment.submit);
        }}
        width='fit-content'
      >
        <ParagraphBody>Thêm bài nộp</ParagraphBody>
      </Button>
    </Box>
  );
};

export default LecturerCourseAssignmentDetails;
