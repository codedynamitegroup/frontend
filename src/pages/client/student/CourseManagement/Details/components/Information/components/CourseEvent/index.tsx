import { ListItemButton, Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ParagraphBody from "components/text/ParagraphBody";
import i18next from "i18next";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { standardlizeUTCStringToLocaleString } from "utils/moment";

interface PropData {
  name: string;
  type: NotificationComponentTypeEnum;
  endDate: string;
}

const StudentCourseEvent = (props: PropData) => {
  const { name, type, endDate } = props;
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  let courseTypeString = "";
  const backgroundColor = "white";
  const textDecorLine = "none";
  switch (type) {
    case NotificationComponentTypeEnum.ASSIGNMENT:
      courseTypeString = t("common_type_assignment");
      break;
    case NotificationComponentTypeEnum.EXAM:
      courseTypeString = t("common_type_exam");
      break;
    default:
      break;
  }

  useEffect(() => {
    setCurrentLang(i18next.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18next.language]);

  return (
    <ListItem alignItems='flex-start' sx={{ backgroundColor: backgroundColor }}>
      <ListItemButton>
        <ListItemText
          primary={<ParagraphBody fontWeight={600}>{name}</ParagraphBody>}
          secondary={
            <>
              <ParagraphBody fontWeight={600}>{courseTypeString}</ParagraphBody>
              <Stack direction='row' spacing={1} alignItems='center'>
                <ParagraphBody style={{ textDecoration: textDecorLine }} fontWeight={600}>
                  {`${t("common_deadline")}:`}
                </ParagraphBody>
                <ParagraphBody style={{ textDecoration: textDecorLine }} fontWeight={300}>
                  {standardlizeUTCStringToLocaleString(endDate as string, currentLang)}
                </ParagraphBody>
              </Stack>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default StudentCourseEvent;
