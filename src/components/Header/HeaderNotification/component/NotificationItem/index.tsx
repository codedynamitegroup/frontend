import {
  Avatar,
  BoxProps,
  Card,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  Stack
} from "@mui/material";
import Heading6 from "components/text/Heading6";
import { notificaionIcon } from "config/images";
import { NotificationEntity } from "models/courseService/entity/NotificationEntity";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useCallback, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { NotificationService } from "services/courseService/NotificationService";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";

enum NotificationType {
  EXAM,
  DEADLINE,
  HOMEWORK,
  CONTEST,
  SYNC,
  POST
}
interface ContentContainer {
  iconPath: string;
  generalTitle: string;
}

interface NotificationItemProps extends BoxProps {
  type: NotificationType;
  content: string;
  time: string;
  title: string;
  notification: NotificationEntity;
  refetch: () => Promise<void>;
}

const NotificationItem = (props: NotificationItemProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mapTypeToContent = new Map<NotificationType, ContentContainer>();
  const [showMoreMenuButton, setShowMoreMenuButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

  mapTypeToContent.set(NotificationType.EXAM, {
    iconPath: notificaionIcon.examIcon,
    generalTitle: t("notification_title_exam")
  });
  mapTypeToContent.set(NotificationType.DEADLINE, {
    iconPath: notificaionIcon.deadlineIcon,
    generalTitle: t("notification_title_deadline")
  });
  mapTypeToContent.set(NotificationType.HOMEWORK, {
    iconPath: notificaionIcon.homeworkIcon,
    generalTitle: t("notification_title_new_assignment")
  });
  mapTypeToContent.set(NotificationType.CONTEST, {
    iconPath: notificaionIcon.contestIcon,
    generalTitle: t("notification_title_registerd_contest")
  });
  mapTypeToContent.set(NotificationType.SYNC, {
    iconPath: notificaionIcon.syncIcon,
    generalTitle: t("notification_title_system_sync")
  });
  mapTypeToContent.set(NotificationType.POST, {
    iconPath: notificaionIcon.announcementIcon,
    generalTitle: t("notification_title_new_post")
  });

  const generalContent: ContentContainer | undefined = mapTypeToContent.get(props.type);

  const handleUpdateReadStatusByNotificationId = useCallback(
    async (id: string, read: boolean, isShowToast: boolean) => {
      try {
        const updateReadStatusForNotificationResponse =
          await NotificationService.updateReadStatusForNotification(id, read);
        if (updateReadStatusForNotificationResponse) {
          props.refetch();
        }
      } catch (error: any) {
        if (isShowToast) {
          dispatch(setErrorMess(t("notification_mark_as_unread_fail")));
        }
      }
    },
    [dispatch, props, t]
  );

  const handleDeleteByNotificationId = useCallback(
    async (id: string) => {
      try {
        const deleteNotificationResponse = await NotificationService.deleteNotificationById(id);
        if (deleteNotificationResponse) {
          props.refetch();
          dispatch(setSuccessMess(t("notification_delete_success")));
        }
      } catch (error: any) {
        dispatch(setErrorMess(t("notification_delete_fail")));
      }
    },
    [dispatch, props, t]
  );

  const onHandleClickCard = async () => {
    if (!props.notification.isRead) {
      await handleUpdateReadStatusByNotificationId(props.notification.notificationId, true, false);
    }
    navigate(props.notification.contextUrl);
  };

  const onHandleClickMoreMenuMarkAsUnread = async () => {
    await handleUpdateReadStatusByNotificationId(props.notification.notificationId, false, true);
  };

  const onHandleClickMoreMenuDelete = () => {
    setIsOpenConfirmDelete(true);
  };

  const onHandleDelete = async () => {
    await handleDeleteByNotificationId(props.notification.notificationId);
    onCancelConfirmDelete();
  };

  return (
    <>
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_notification_description")}
        onCancel={onCancelConfirmDelete}
        onDelete={onHandleDelete}
      />
      <Card
        sx={{
          height: "130px",
          width: "100%",
          border: "1px solid #E0E0E0",
          boxShadow: "none",
          borderRadius: 0,
          backgroundColor: props.notification.isRead ? "#F5F5F5" : "#FFFFFF",
          position: "relative" // Add relative position for notification circle
        }}
      >
        <CardActionArea
          sx={{
            padding: 2
          }}
          onClick={onHandleClickCard}
          onMouseEnter={() => {
            if (!showMoreMenuButton) {
              setShowMoreMenuButton(true); // Set showMoreMenuButton to true when mouse enters
            }
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            <Avatar
              sx={{ width: 40, height: 40 }}
              variant='rounded'
              src={generalContent?.iconPath}
            />
            <Stack direction={"column"}>
              <Heading6
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
                colorname={props.notification.isRead ? "--gray-60" : "--eerie-black-00"}
              >
                {props.title || ""}
              </Heading6>
              <Heading6
                fontWeight={200}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
                colorname={props.notification.isRead ? "--gray-50" : "--eerie-black-00"}
              >
                {props.time}
              </Heading6>
              <Heading6
                fontWeight={100}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
                colorname={props.notification.isRead ? "--gray-50" : "--eerie-black-00"}
              >
                {props.content}
              </Heading6>
            </Stack>
          </Stack>
        </CardActionArea>
        {showMoreMenuButton && (
          <IconButton
            aria-label='more'
            id='long-button'
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup='true'
            sx={{
              position: "absolute",
              top: 50,
              right: 30,
              display: "flex", // Change display to flex for centering icon
              alignItems: "center",
              justifyContent: "center",
              width: 35, // Adjust size as needed
              height: 35,
              borderRadius: "50%",
              backgroundColor: "var(--gray-10)", // Adjust color based on read state,
              "&:hover": {
                backgroundColor: "var(--gray-20)" // Adjust color based on read state
              }
            }}
            onClick={handleClick}
          >
            <MoreHorizIcon fontSize='medium' />
          </IconButton>
        )}
        <Menu
          id='long-menu'
          MenuListProps={{
            "aria-labelledby": "long-button"
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch"
            }
          }}
        >
          {[
            {
              value: "Mark as unread",
              title: "Đánh dấu là chưa đọc",
              onClick: () => {
                onHandleClickMoreMenuMarkAsUnread();
              }
            },
            {
              value: "Delete",
              title: "Gỡ thông báo này",
              onClick: () => {
                onHandleClickMoreMenuDelete();
              }
            }
          ].map((option) => (
            <MenuItem
              key={option.value}
              onClick={option.onClick}
              disabled={
                option.value === "Mark as unread" && !props.notification.isRead ? true : false
              }
            >
              {option.value === "Mark as unread" ? (
                <Stack direction='row' alignItems='center' gap={1}>
                  <CheckCircleOutlineIcon />
                  <Heading6>{option.title}</Heading6>
                </Stack>
              ) : (
                <Stack direction='row' alignItems='center' gap={1}>
                  <CancelPresentationIcon />
                  <Heading6>{option.title}</Heading6>
                </Stack>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Card>
    </>
  );
};
export { NotificationType };
export default NotificationItem;
