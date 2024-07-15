import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextField";
import { SectionEntity } from "models/courseService/entity/SectionEntity";
import { SectionService } from "services/courseService/SectionService";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { PostEntity } from "models/courseService/entity/PostEntity";
import TextEditor from "components/editor/TextEditor";
import { PostService } from "services/courseService/PostService";
import { UpdateAnnoucementCommand } from "models/courseService/entity/update/UpdateAnnoucementCommand";
import { clearPosts } from "reduxes/courseService/post";

type EditSectionDialogProps = {
  open: boolean;
  onClose: () => void;
  post: PostEntity | null;
};

interface IFormData {
  title: string;
  content: string;
}

const EditAnnoucementDialog = ({ open, onClose, post }: EditSectionDialogProps) => {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required(t("title_required")),
      content: yup.string().required(t("content_required"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content
      });
    }
  }, [post, reset]);

  const dispatch = useDispatch();

  const handleEdit = async (data: IFormData) => {
    if (!post) return;
    const updateAnnoucementCommand: UpdateAnnoucementCommand = {
      content: data.content,
      title: data.title
    };
    await PostService.updatePost(post.postId, updateAnnoucementCommand)
      .then((res) => {
        dispatch(setSuccessMess("Edit annoucement successfully"));
        dispatch(clearPosts());
        onClose();
      })
      .catch((error) => {
        dispatch(setErrorMess("Failed to edit annoucement"));
        console.error("Failed to edit annoucement", error);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} className={classes["dialog"]}>
      <form onSubmit={handleSubmit(handleEdit)}>
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id='customized-dialog-title'
          translation-key='question_bank_edit_category'
        >
          Edit Announcement
        </DialogTitle>
        <IconButton
          aria-label='close'
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className={classes["dialog-content"]}>
          <InputTextField
            label={t("course_lecturer_announcement_title")}
            type='text'
            inputRef={register("title")}
            errorMessage={errors?.title?.message}
            width='100%'
          />
          <Box className={classes.announcementContent}>
            <Controller
              defaultValue=''
              control={control}
              name='content'
              render={({ field }) => (
                <TextEditor
                  title={t("course_lecturer_enter_announcement")}
                  roundedBorder={true}
                  error={Boolean(errors?.content)}
                  placeholder={`${t("course_lecturer_enter_announcement")}...`}
                  required
                  translation-key='course_lecturer_enter_announcement'
                  {...field}
                  className={classes.textEditor}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions className={classes["dialog-actions"]}>
          <Button btnType={BtnType.Secondary} onClick={onClose}>
            {t("common_cancel")}
          </Button>
          <Button btnType={BtnType.Primary} type='submit'>
            {t("common_save")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAnnoucementDialog;
