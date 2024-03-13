import { Stack, Avatar, Box, BoxProps } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Heading6 from "components/text/Heading6";
import { notificaionIcon } from "config/images";
import { grey } from "@mui/material/colors";

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
const mapTypeToContent = new Map<NotificationType, ContentContainer>();
mapTypeToContent.set(NotificationType.EXAM, {
  iconPath: notificaionIcon.examIcon,
  generalTitle: "Bài kiểm tra"
});
mapTypeToContent.set(NotificationType.DEADLINE, {
  iconPath: notificaionIcon.deadlineIcon,
  generalTitle: "Deadline khóa học"
});
mapTypeToContent.set(NotificationType.HOMEWORK, {
  iconPath: notificaionIcon.homeworkIcon,
  generalTitle: "Bài tập về nhà mới"
});
mapTypeToContent.set(NotificationType.CONTEST, {
  iconPath: notificaionIcon.contestIcon,
  generalTitle: "Cuộc thi mà bạn đăng kí"
});
mapTypeToContent.set(NotificationType.SYNC, {
  iconPath: notificaionIcon.syncIcon,
  generalTitle: "Đồng bộ hệ thống"
});

interface NotificationItemProps extends BoxProps {
  type: NotificationType;
  content: string;
  time: string;
}

const NotificationItem = (props: NotificationItemProps) => {
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
