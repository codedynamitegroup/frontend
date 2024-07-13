import React from "react";
import { Card, CardContent, Typography, Divider, Link, Box, Avatar, Grid } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAuth from "hooks/useAuth";
import { generateHSLColorByRandomText } from "utils/generateColorByText";

const NotificationCard = () => {
  const content = `
    <ul>
      <li>👉 Các em xem điểm tổng kết môn học trong file đính kèm (sheet Summary)</li>
      <li>👉 Sinh viên phúc khảo bằng cách comment vào post này, ghi rõ cột điểm cần phúc khảo; riêng điểm đồ án nhóm, sinh viên gửi phúc khảo cho thầy Quý (theo thông tin đã được cung cấp ở post trước)</li>
      <li>👉 Hạn chót phúc khảo: 21h ngày chủ nhật (4.2.2024)</li>
    </ul>
    <hr />
    <p>⚠️⚠️⚠️ <strong>QUAN TRỌNG</strong> ⚠️⚠️⚠️</p>
    <ul>
      <li>👉 Sáng thứ 2 (5.2.2024), các em ghé I82-&gt;I84 ký tên vào bảng điểm trong khoảng thời gian <strong>9h30 - 10h30</strong></li>
      <li>👉 Có thể ký tên thay cho bạn cùng nhóm của mình</li>
    </ul>
    <hr />
    <p><a href="https://docs.google.com/spreadsheets/d/20CLC-KTPM1-WebNC-Sc" target="_blank" rel="noopener noreferrer">20CLC-KTPM1-WebNC-Sc...</a></p>
  `;
  const { loggedUser } = useAuth();

  return (
    <Card>
      <CardContent>
        <Grid container alignItems='center' spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${"Tien"} ${"Ngoc"}`)}`
              }}
              alt={loggedUser.email}
              src={loggedUser.avatarUrl}
            >
              {"T"}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant='h6' component='div'>
              Tien Ngoc
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Feb 3, 2024
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <ReactQuill value={content} readOnly={true} theme='bubble' />
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
