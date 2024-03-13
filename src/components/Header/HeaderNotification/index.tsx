import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider, Stack, Box, Chip } from "@mui/material";
import classes from "./styles.module.scss";
import { useState } from "react";
import TextTitle from "components/text/TextTitle";
import NotificationItem, { NotificationType } from "./component/NotificationItem";
const HeaderNotification = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterChips, setFilterChips] = useState({ all: true, event: false, sync: false });
  const resetFilterChips = { all: false, event: false, sync: false };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        className={classes.notification}
        onClick={handleClick}
        aria-controls={open ? "notification-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
      >
        <NotificationsIcon sx={{ color: "white" }} />
      </IconButton>
      <Menu
        MenuListProps={{
          "aria-labelledby": "long-button"
        }}
        id='notification-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            style: {
              maxHeight: "80dvh",
              width: "400px"
            }
          }
        }}
      >
        <Stack>
          <Box className={classes["notification-title"]}>
            <TextTitle fontSize='24px'>Thông báo</TextTitle>
          </Box>
          <Stack direction='row' className={classes["notification-title"]} spacing={1}>
            <Chip
              label={<TextTitle>Tất cả</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, all: true })}
              className={filterChips.all ? classes["chip-filter-selected"] : classes["chip-filter"]}
            />
            <Chip
              label={<TextTitle>Sự kiện</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, event: true })}
              className={
                filterChips.event ? classes["chip-filter-selected"] : classes["chip-filter"]
              }
            />
            <Chip
              label={<TextTitle>Đồng bộ</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, sync: true })}
              className={
                filterChips.sync ? classes["chip-filter-selected"] : classes["chip-filter"]
              }
            />
          </Stack>

          <Divider sx={{ marginTop: "8px" }} />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.DEADLINE}
            content='Bạn còn 1 ngày để hoàn thành bài tập 1'
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.CONTEST}
            content='Cuộc thi ai là siêu dev sẽ mở sau 1 ngày.'
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.EXAM}
            content='Bài kiểm tra của môn nmlt sẽ bắt đầu sau 4 tiếng.'
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.HOMEWORK}
            content='Có bài tập mới trong khóa học nmlt'
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.SYNC}
            content='Khóa học nmlt trường hcmus vừa đồng bộ với hệ thống'
            time='12/03/2024 11:00:00'
          />
        </Stack>
      </Menu>
    </>
  );
};

export default HeaderNotification;
