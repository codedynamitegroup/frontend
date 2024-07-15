import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Link,
  Box,
  Avatar,
  Grid,
  Stack,
  Tooltip,
  IconButton
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAuth from "hooks/useAuth";
import { generateHSLColorByRandomText } from "utils/generateColorByText";
import { PostEntity } from "models/courseService/entity/PostEntity";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import i18next from "i18next";
import Heading5 from "components/text/Heading5";
import ParagraphBody from "components/text/ParagraphBody";
import classes from "./styles.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface NotificationCardProps {
  post: PostEntity;
}
const NotificationCard = ({ post }: NotificationCardProps) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);
  const { isLecturer } = useAuth();

  return (
    <Card className={classes.annoucementCard}>
      <CardContent>
        <Grid container alignItems='center' spacing={2} flexDirection={"row"}>
          <Grid item>
            <Avatar
              sx={{
                bgcolor: `${generateHSLColorByRandomText(`${post?.createdBy.firstName} ${post?.createdBy.lastName}`)}`
              }}
              alt={post?.createdBy.email}
              src={post?.createdBy.avatarUrl}
            >
              {post?.createdBy.firstName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid
            item
            xs={11}
            flexDirection={"row"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack flexDirection={"column"}>
              <Box>
                <Heading5>{post?.title}</Heading5>
              </Box>
              <Stack flexDirection={"row"} alignItems={"center"}>
                <ParagraphBody fontWeight={500} colorname='--gray-50'>
                  By&nbsp;
                </ParagraphBody>
                <ParagraphBody fontWeight={500} colorname='--blue-3'>
                  {post?.createdBy.firstName} {post?.createdBy.lastName}
                </ParagraphBody>
                <ParagraphBody fontWeight={500} colorname='--gray-50'>
                  &nbsp;-&nbsp;
                  {standardlizeUTCStringToLocaleString(post?.createdAt as string, currentLang)}
                </ParagraphBody>
              </Stack>
            </Stack>

            {isLecturer && (
              <Stack flexDirection={"row"}>
                <Tooltip title='Edit'>
                  <IconButton onClick={() => {}}>
                    <EditIcon className={classes.iconEdit} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton onClick={() => {}}>
                    <DeleteIcon className={classes.iconDelete} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <ReactQuill value={post?.content} readOnly={true} theme='bubble' />
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
