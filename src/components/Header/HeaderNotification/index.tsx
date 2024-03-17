import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import { Divider, Stack, Box, Chip } from "@mui/material";
import classes from "./styles.module.scss";
import { useState } from "react";
import TextTitle from "components/text/TextTitle";
import NotificationItem, { NotificationType } from "./component/NotificationItem";
import { useTranslation } from "react-i18next";

const HeaderNotification = () => {
  const { t } = useTranslation();
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
            <TextTitle fontSize='24px' translation-key='common_notification'>
              {t("common_notification")}
            </TextTitle>
          </Box>
          <Stack direction='row' className={classes["notification-title"]} spacing={1}>
            <Chip
              label={<TextTitle translation-key='common_all'>{t("common_all")}</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, all: true })}
              className={filterChips.all ? classes["chip-filter-selected"] : classes["chip-filter"]}
            />
            <Chip
              label={<TextTitle translation-key='common_event'>{t("common_event")}</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, event: true })}
              className={
                filterChips.event ? classes["chip-filter-selected"] : classes["chip-filter"]
              }
            />
            <Chip
              label={<TextTitle translation-key='common_sync'>{t("common_sync")}</TextTitle>}
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
            content={t("notification_title_deadline_content", {
              time: `1 ${t("contest_detail_feature_day")}`,
              deadlineName: "Bài tập 1"
            })}
            time='12/03/2024 11:00:00'
            translation-key='notification_title_deadline_content'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.CONTEST}
            content={`${t("notification_title_registerd_contest_content", { contestName: "Ai là siêu dev", time: `1 ${t("contest_detail_feature_day")}` })}`}
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.EXAM}
            content={`${t("notification_title_exam_content", { courseName: "Nhập môn lập trình", time: `4 ${t("contest_detail_feature_hour")}` })}`}
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.HOMEWORK}
            content={`${t("notification_title_new_assignment_content", { courseName: "Nhập môn lập trình" })}`}
            time='12/03/2024 11:00:00'
          />
          <NotificationItem
            className={classes["notification-item"]}
            type={NotificationType.SYNC}
            content={`${t("notification_title_system_sync_content", { courseName: "Nhập môn lập trình" })}`}
            time='12/03/2024 11:00:00'
          />
        </Stack>
      </Menu>
    </>
  );
};

export default HeaderNotification;
