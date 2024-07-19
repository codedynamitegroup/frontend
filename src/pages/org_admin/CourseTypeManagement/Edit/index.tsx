import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextField";
import { SectionEntity } from "models/courseService/entity/SectionEntity";
import { SectionService } from "services/courseService/SectionService";
import { dispatch } from "d3";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useParams } from "react-router-dom";
import { clearSections } from "reduxes/courseService/section";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";

type EditCourseTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  courseType?: CourseTypeEntity;
};

interface IFormData {
  name: string;
}

const EditCourseTypeDialog = ({ open, onClose, courseType }: EditCourseTypeDialogProps) => {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("course_type_name_required"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const dispatch = useDispatch();
  useEffect(() => {
    if (courseType) {
      reset({
        name: courseType.name
      });
    }
  }, [courseType, reset]);
  const { courseId } = useParams<{ courseId: string }>();

  const handleCreate = async (data: IFormData) => {
    if (!courseId) return;
    // await SectionService.createSection(courseId, data.sectionName)
    //   .then((res) => {
    //     dispatch(setSuccessMess("Create section successfully"));
    //     dispatch(clearSections());
    //     onClose();
    //   })
    //   .catch((error) => {
    //     dispatch(setErrorMess("Failed to create section"));
    //     console.error("Failed to create section", error);
    //   });
  };
  return (
    <Dialog open={open} onClose={onClose} className={classes["dialog"]}>
      <form onSubmit={handleSubmit(handleCreate)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Edit Course Type
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
            label={t("course_type_name")}
            type='text'
            inputRef={register("name")}
            errorMessage={errors?.name?.message}
            width='100%'
          />
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

export default EditCourseTypeDialog;
