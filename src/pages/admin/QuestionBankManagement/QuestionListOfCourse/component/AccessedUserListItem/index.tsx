import { Grid, Avatar, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ParagraphBody from "components/text/ParagraphBody";
import { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
enum AccessLevel {
  OWNER = "OWNER",
  EDITOR = "EDITOR"
}
interface AccessedUserListItemProp {
  avatarUrl: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
}
const AccessedUserListItem = (props: AccessedUserListItemProp) => {
  const { t } = useTranslation();
  const [accessLevel, setAccessLevel] = useState(
    props.accessLevel === AccessLevel.EDITOR ? "20" : "10"
  );
  const handleChange = (event: SelectChangeEvent) => {
    setAccessLevel(event.target.value);
  };
  return (
    <Grid container>
      <Grid container md={6} spacing={1}>
        <Grid item>
          <Avatar
            sx={{ width: 50, height: 50 }}
            variant='circular'
            src={props.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png"}
          />
        </Grid>
        <Grid item>
          <ParagraphBody>{props.name}</ParagraphBody>
          <ParagraphBody fontWeight={100} fontSize={"12px"}>
            {props.email}
          </ParagraphBody>
        </Grid>
      </Grid>
      <Grid container md={6} alignItems='center' justifyContent='flex-end'>
        {props.accessLevel !== AccessLevel.EDITOR ? (
          <ParagraphBody fontWeight={100} translation-key='question_bank_access_right_owner'>
            {t("question_bank_access_right_owner")}
          </ParagraphBody>
        ) : (
          <FormControl variant='outlined' className={classes.formControl}>
            <Select
              labelId='access-level-edit-label'
              id='access-level-edit'
              value={accessLevel}
              onChange={handleChange}
            >
              <MenuItem value={10} translation-key='question_bank_access_right_editor'>
                {t("question_bank_access_right_editor")}
              </MenuItem>
              <MenuItem value={20} translation-key='question_bank_access_right_readonly'>
                {t("question_bank_access_right_readonly")}
              </MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};

export default memo(AccessedUserListItem);
export { AccessLevel };
export type { AccessedUserListItemProp };
