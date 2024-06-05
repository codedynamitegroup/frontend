import { Stack, Avatar, Box, BoxProps } from "@mui/material";
import Heading6 from "components/text/Heading6";
import { notificaionIcon } from "config/images";
import { grey } from "@mui/material/colors";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

enum NotificationType {
  EXAM,
  DEADLINE,
  HOMEWORK,
  CONTEST,
  SYNC
}
interface ContentContainer {
  iconPath: string;
  generalTitle: string;
}

interface NotificationItemProps extends BoxProps {
  type: NotificationType;
  content: string;
  time: string;
}

const NotificationItem = (props: NotificationItemProps) => {
  const { t } = useTranslation();
  const mapTypeToContent = new Map<NotificationType, ContentContainer>();
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
  const boxProps: BoxProps = props;

  const generalContent: ContentContainer | undefined = mapTypeToContent.get(props.type);
  return (
    <Box
      {...boxProps}
      sx={{ "&:hover": { cursor: "pointer", backgroundColor: grey[100] } }}
      paddingX={2}
    >
      <Stack direction='row' alignItems='center' spacing={1}>
        <Avatar sx={{ width: 40, height: 40 }} variant='rounded' src={generalContent?.iconPath} />
        <Stack>
          <Heading6>{generalContent?.generalTitle}</Heading6>
          <Heading6 fontWeight={200}>{props.time}</Heading6>
          <Heading6 fontWeight={100}>{props.content}</Heading6>
        </Stack>
      </Stack>
    </Box>
  );
};
export { NotificationType };
export default NotificationItem;
