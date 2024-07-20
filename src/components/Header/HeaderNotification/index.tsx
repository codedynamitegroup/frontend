import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Box, Chip, CircularProgress, Divider, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import useAuth from "hooks/useAuth";
import i18next from "i18next";
import { NotificationEntity } from "models/courseService/entity/NotificationEntity";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setInfoMess } from "reduxes/AppStatus";
import { SocketData } from "reduxes/Socket";
import { NotificationService } from "services/courseService/NotificationService";
import { RootState } from "store";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import NotificationItem, { NotificationType } from "./component/NotificationItem";
import classes from "./styles.module.scss";

const HeaderNotification = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isLoggedIn, loggedUser } = useAuth();

  const socketState = useSelector((state: RootState) => state.socket);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterChips, setFilterChips] = useState({ all: true, unread: false });
  const resetFilterChips = { all: false, unread: false };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  const [notificationData, setNotificationData] = useState<{
    isLoading: boolean;
    isLoadingMore: boolean;
    notifications: NotificationEntity[];
    numOfUnreadNotifications: number;
    totalPages: number;
    currentPage: number;
    totalItems: number;
  }>({
    isLoading: false,
    isLoadingMore: false,
    notifications: [],
    numOfUnreadNotifications: 0,
    totalPages: 0,
    currentPage: 0,
    totalItems: 0
  });

  const getAllMyNotifications = useCallback(
    async ({ pageNo = 0, pageSize = 10 }: { pageNo?: number; pageSize?: number }) => {
      try {
        const isRead = filterChips.unread ? false : undefined;
        const getAllMyNotifications: {
          notifications: NotificationEntity[];
          numOfUnreadNotifications: number;
          currentPage: number;
          totalPages: number;
          totalItems: number;
        } = await NotificationService.getMyNotifications({
          isRead,
          pageNo,
          pageSize
        });
        return getAllMyNotifications;
      } catch (error: any) {
        return null;
      }
    },
    [filterChips.unread]
  );

  const handleGetAllMyNotification = useCallback(
    async ({ pageNo = 0, pageSize = 10 }: { pageNo?: number; pageSize?: number }) => {
      setNotificationData((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const isRead = filterChips.unread ? false : undefined;
        const getAllMyNotifications: {
          notifications: NotificationEntity[];
          numOfUnreadNotifications: number;
          currentPage: number;
          totalPages: number;
          totalItems: number;
        } = await NotificationService.getMyNotifications({
          isRead,
          pageNo,
          pageSize
        });
        setNotificationData((prevState) => ({
          ...prevState,
          isLoading: false,
          notifications: getAllMyNotifications.notifications,
          currentPage: getAllMyNotifications.currentPage,
          totalPages: getAllMyNotifications.totalPages,
          totalItems: getAllMyNotifications.totalItems
        }));
      } catch (error: any) {
        setNotificationData((prevState) => ({ ...prevState, isLoading: false }));
      }
    },
    [filterChips.unread]
  );

  const fetchMoreData = useCallback(async () => {
    if (notificationData.isLoadingMore) {
      return;
    }

    if (
      notificationData.currentPage < notificationData.totalPages &&
      notificationData.totalPages > 1
    ) {
      setNotificationData((prevState) => ({ ...prevState, isLoadingMore: true }));
      const nextPageData = await getAllMyNotifications({
        pageNo: notificationData.currentPage + 1
      });
      if (nextPageData) {
        setNotificationData((prevState) => {
          const newNotifications = [
            ...prevState.notifications,
            ...nextPageData.notifications
          ].filter((notification, index, self) => {
            return (
              index === self.findIndex((t) => t.notificationId === notification.notificationId)
            );
          });
          return {
            ...prevState,
            isLoadingMore: false,
            notifications: newNotifications,
            numOfUnreadNotifications: nextPageData.numOfUnreadNotifications,
            currentPage: nextPageData.currentPage,
            totalPages: nextPageData.totalPages,
            totalItems: nextPageData.totalItems
          };
        });
      } else {
        setNotificationData((prevState) => ({ ...prevState, isLoadingMore: false }));
      }
    }
  }, [
    getAllMyNotifications,
    notificationData.currentPage,
    notificationData.isLoadingMore,
    notificationData.totalPages
  ]);

  const fetchInitialData = useCallback(async () => {
    if (isLoggedIn) {
      setNotificationData((prevState) => ({ ...prevState, isLoading: true }));
      const data = await getAllMyNotifications({});
      if (data) {
        setNotificationData((prevState) => ({
          ...prevState,
          isLoading: false,
          notifications: data.notifications,
          numOfUnreadNotifications: data.numOfUnreadNotifications,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems
        }));
      }
      setNotificationData((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, [getAllMyNotifications, isLoggedIn]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData, anchorEl]);

  useEffect(() => {
    if (isLoggedIn && socketState && socketState.socket) {
      socketState.socket.on("get_notification", (data: SocketData) => {
        handleGetAllMyNotification({});
        dispatch(
          setInfoMess({
            title: data?.message?.subject || "",
            content: data?.message?.component === "POST" ? "" : data?.message?.fullMessage || ""
          })
        );
      });
    }
    return () => {
      if (socketState && socketState.socket) {
        socketState.socket.off("get_notification");
      }
    };
  }, [dispatch, handleGetAllMyNotification, isLoggedIn, socketState]);

  return (
    <>
      <IconButton
        className={classes.notification}
        onClick={handleClick}
        aria-controls={open ? "notification-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        sx={{
          marginRight: "10px"
        }}
      >
        <Badge
          badgeContent={
            notificationData.numOfUnreadNotifications > 0
              ? notificationData.numOfUnreadNotifications
              : null
          }
          color='primary'
        >
          <NotificationsIcon sx={{ color: "var(--gray-40)" }} />
        </Badge>
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
              // maxHeight: "80dvh",
              width: "400px",
              overflow: "hidden"
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
              // className={filterChips.all ? classes["chip-filter-selected"] : classes["chip-filter"]}
              sx={{ backgroundColor: filterChips.all ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0)" }}
            />
            <Chip
              label={<TextTitle translation-key='common_unread'>{t("common_unread")}</TextTitle>}
              onClick={() => setFilterChips({ ...resetFilterChips, unread: true })}
              sx={{
                backgroundColor: filterChips.unread ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0)"
              }}
            />
          </Stack>

          <Divider sx={{ marginTop: "8px" }} />
          <Box
            component={"div"}
            id='scrollableDiv'
            sx={{
              height: "40dvh",
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "4px"
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "var(--gray-20)"
              }
            }}
          >
            {!notificationData.isLoading ? (
              notificationData.notifications && notificationData.notifications.length > 0 ? (
                <InfiniteScroll
                  dataLength={notificationData.totalItems}
                  next={() => {}}
                  hasMore={
                    notificationData.currentPage < notificationData.totalPages &&
                    notificationData.totalPages > 1
                  }
                  onScroll={(e: MouseEvent) => {
                    const target = e.target as HTMLDivElement;
                    // check if the scroll is higher than 80% of the scrollable div
                    if (
                      target.scrollTop + target.clientHeight >=
                      target.scrollHeight - target.clientHeight * 0.2
                    ) {
                      fetchMoreData();
                    }
                  }}
                  loader={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginY: "10px"
                      }}
                    >
                      <CircularProgress size={30} />
                    </Box>
                  }
                  style={{
                    overflow: "hidden"
                  }}
                  scrollableTarget='scrollableDiv'
                  endMessage={
                    <ParagraphBody
                      fontWeight={600}
                      translation-key='notification_no_more_data'
                      sx={{
                        textAlign: "center"
                      }}
                      marginTop={"5px"}
                    >
                      {t("notification_no_more_data")}
                    </ParagraphBody>
                  }
                >
                  {notificationData.notifications.map((notification, index) => (
                    <NotificationItem
                      key={index}
                      className={classes["notification-item"]}
                      type={
                        notification.component === NotificationComponentTypeEnum.CONTEST
                          ? NotificationType.CONTEST
                          : notification.component === NotificationComponentTypeEnum.EXAM
                            ? NotificationType.EXAM
                            : notification.component === NotificationComponentTypeEnum.ASSIGNMENT
                              ? NotificationType.HOMEWORK
                              : notification.component === NotificationComponentTypeEnum.POST
                                ? NotificationType.POST
                                : NotificationType.SYNC
                      }
                      content={notification.fullMessage}
                      time={standardlizeUTCStringToLocaleString(
                        notification.createdAt,
                        currentLang
                      )}
                      title={notification.subject}
                      notification={notification}
                      refetch={fetchInitialData}
                    />
                  ))}
                </InfiniteScroll>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                  }}
                >
                  <TextTitle fontSize='16px' translation-key='notification_no_data'>
                    {t("notification_no_data")}
                  </TextTitle>
                </Box>
              )
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {/* <NotificationItem
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
            /> */}
          </Box>
        </Stack>
      </Menu>
    </>
  );
};

export default HeaderNotification;
