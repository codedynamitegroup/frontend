import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  TextField,
  styled
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./styles.module.scss";
import TextTitle from "components/text/TextTitle";
import { Dispatch, useEffect, useState } from "react";
import { Textarea } from "@mui/joy";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";

interface TestCasePopupProps {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  itemEdit: any;
  setItemEdit: Dispatch<React.SetStateAction<any>>;
}

export const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

const TestCasePopup = ({ setOpen, open, itemEdit, setItemEdit }: TestCasePopupProps) => {
  const { t } = useTranslation();
  const [score, setScore] = useState<number>(0);
  const [isSample, setIsSample] = useState<boolean>(false);

  useEffect(() => {
    if (itemEdit) {
      setScore(itemEdit.score);
      setIsSample(itemEdit.isSample);
    }
  }, [itemEdit]);
  const handleCheckboxChange = () => {
    setIsSample(!isSample);
  };
  const handleScoreChange = (e: any) => {
    setScore(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
    setItemEdit(null);
  };

  return (
    <CustomDialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle className={classes.dialogTitle}>
        {!!itemEdit ? (
          <Heading4 translation-key='code_management_detail_update_test_case'>
            {t("code_management_detail_update_test_case")}
          </Heading4>
        ) : (
          <Heading4 translation-key='code_management_detail_add_test_case'>
            {t("code_management_detail_add_test_case")}
          </Heading4>
        )}

        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <Box component='form' className={classes.formBody} autoComplete='off'>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <Grid container>
                  <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                    <TextTitle translation-key='common_score'>{t("common_score")}</TextTitle>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={score}
                      type='number'
                      size='small'
                      onChange={handleScoreChange}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
              <FormControl>
                <Grid container>
                  <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                    <TextTitle translation-key='common_template'>{t("common_template")}</TextTitle>
                  </Grid>
                  <Grid item xs={6}>
                    <Checkbox
                      color='primary'
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 35 } }}
                      checked={isSample}
                      onChange={handleCheckboxChange}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
          <FormControl fullWidth className={classes.inputContainer}>
            <TextTitle>{t("detail_problem_input")}</TextTitle>
            <Textarea
              defaultValue={itemEdit ? itemEdit.inputValue : ""}
              sx={{ backgroundColor: "white" }}
              minRows={5}
              maxRows={5}
            />
          </FormControl>
          <FormControl fullWidth className={classes.inputContainer}>
            <TextTitle translation-key='detail_problem_output'>
              {t("detail_problem_output")}
            </TextTitle>
            <Textarea
              defaultValue={itemEdit ? itemEdit.outputValue : ""}
              sx={{ backgroundColor: "white" }}
              minRows={5}
              maxRows={5}
            />
          </FormControl>
          <Box className={classes.btnWrapper}>
            <Button btnType={BtnType.Outlined} onClick={onClose} translation-key='common_cancel'>
              {t("common_cancel")}
            </Button>
            <Button btnType={BtnType.Primary} translation-key='course_lecturer_assignment_add_new'>
              {t("course_lecturer_assignment_add_new")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </CustomDialog>
  );
};

export default TestCasePopup;
