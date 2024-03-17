import AccessedUserListItem, {
  AccessLevel,
  AccessedUserListItemProp
} from "../AccessedUserListItem";
import ParagraphBody from "components/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import {
  Stack,
  Grid,
  DialogContent,
  DialogActions,
  IconButton,
  DialogTitle,
  Dialog,
  DialogProps
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Textarea } from "@mui/joy";
import { useState, KeyboardEvent, memo } from "react";
import { useTranslation } from "react-i18next";
interface AccessedUserListDialogProps extends DialogProps {
  setOpenAccessDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const dumpData: AccessedUserListItemProp = {
  name: "Nguyễn Quốc Tu",
  email: "abc@gmail.com",
  avatarUrl:
    "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90",
  accessLevel: AccessLevel.EDITOR
};
const AccessedUserListDialog = ({ setOpenAccessDialog, ...props }: AccessedUserListDialogProps) => {
  const { t } = useTranslation();
  const [addingPeople, setAddingPeople] = useState(false);
  const [addingPeopleList, setAddingPeopleList] = useState<AccessedUserListItemProp[]>([]);
  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      setAddingPeopleList([...addingPeopleList, dumpData]);
    }
  };
  const handleCloseAddingPeople = () => {
    setAddingPeople(false);
    setAddingPeopleList([]);
  };
  return (
    <Dialog {...props} onClose={() => setOpenAccessDialog(false)}>
      <Grid container justifyContent='space-between' direction='row'>
        <Grid container xs={9}>
          {addingPeople && (
            <Grid container xs={1} alignItems='center'>
              <IconButton
                aria-label='back'
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  marginLeft: 1
                }}
                onClick={handleCloseAddingPeople}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
          )}

          <Grid>
            <DialogTitle
              sx={{ m: 0, p: 2 }}
              id='customized-dialog-title'
              translation-key={["question_bank_access_right_list", "question_bank_access_share"]}
            >
              {addingPeople ? t("quesion_bank_access_share") : t("question_bank_access_right_list")}
            </DialogTitle>
          </Grid>
        </Grid>
        <Grid container xs={3} alignItems='center' justifyContent='flex-end'>
          <IconButton
            aria-label='close'
            sx={{
              color: (theme) => theme.palette.grey[500],
              marginRight: 1
            }}
            onClick={() => setOpenAccessDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Textarea
            minRows={1}
            translation-key='common_add'
            placeholder={t("common_add")}
            onClick={() => setAddingPeople(true)}
            onKeyDown={onEnterPress}
          />
          {addingPeople ? (
            <>
              {addingPeopleList.map((value) => (
                <AccessedUserListItem {...value} />
              ))}
              <Textarea
                placeholder={t("question_bank_access_right_message")}
                translation-key='question_bank_access_right_message'
                minRows={3}
              />
            </>
          ) : (
            <>
              <ParagraphBody translation-key='question_bank_access_right_list_title'>
                {t("question_bank_access_right_list_title")}
              </ParagraphBody>
              <Stack spacing={1}>
                <AccessedUserListItem
                  email='nguyenquoctuan385@gmail.com'
                  avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                  name='Nguyễn Quốc Tuấn'
                  accessLevel={AccessLevel.OWNER}
                />
                <AccessedUserListItem
                  email='nguyenquoctuan385@gmail.com'
                  avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                  name='Nguyễn Quốc Tuấn'
                  accessLevel={AccessLevel.EDITOR}
                />
                <AccessedUserListItem
                  email='nguyenquoctuan385@gmail.com'
                  avatarUrl='https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/427838885_3910358709250427_5778115707058543789_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEaQBJmaESxSF-JhRcy_H_-USoIMrk_el9RKggyuT96X4lwFFwY0uqlIqR3h922Kqy7zVWpkIiL9NsvlGVFjHD-&_nc_ohc=lrDJFA7XNvEAX87CHJc&_nc_ht=scontent.fsgn5-12.fna&oh=00_AfAlICWdsi7mYR-2K4wTQd7naZ23M5PLyLv2RbzA2n6T4w&oe=65E1AA90'
                  name='Nguyễn Quốc Tuấn'
                  accessLevel={AccessLevel.EDITOR}
                />
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {addingPeople ? (
          <>
            <Button btnType={BtnType.Outlined} onClick={handleCloseAddingPeople}>
              <ParagraphBody translation-key='common_cancel'> {t("common_cancel")}</ParagraphBody>
            </Button>
            <Button
              btnType={BtnType.Primary}
              onClick={() => setOpenAccessDialog(false)}
              disabled={addingPeopleList.length < 1}
            >
              <ParagraphBody translation-key='common_send'> {t("common_send")}</ParagraphBody>
            </Button>
          </>
        ) : (
          <Button btnType={BtnType.Primary} onClick={() => setOpenAccessDialog(false)} fullWidth>
            <ParagraphBody translation-key='common_save'>{t("common_save")}</ParagraphBody>
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AccessedUserListDialog;
