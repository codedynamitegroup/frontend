import { Stack, Grid, Box, BoxProps } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Heading6 from "components/text/Heading6";

interface NotificationItemProps extends BoxProps {
  type: string;
  content: string;
  time: string;
}
const NotificationItem = (props: NotificationItemProps) => {
  const boxProps: BoxProps = props;
  return (
    <Box {...boxProps}>
      <Stack>
        <Stack>
          <Stack direction='row'>
            <CircleIcon />
            <Heading6>{props.type}</Heading6>
          </Stack>
          <Heading6 fontWeight={200} marginLeft='20px'>
            {props.time}
          </Heading6>
        </Stack>
        <Heading6 fontWeight={100} marginLeft='20px'>
          {props.content}
        </Heading6>
      </Stack>
    </Box>
  );
};

export default NotificationItem;
