import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import classes from "./styles.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextField";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { clearSections } from "reduxes/courseService/section";
import { CourseTypeService } from "services/courseService/CourseTypeService";
import useAuth from "hooks/useAuth";
import { CreateCourseTypeCommand } from "models/courseService/entity/create/CreateCourseTypeCommand";

type CreateCourseTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  handleGetCourseTypes: ({
    searchName,
    pageNo,
    pageSize
  }: {
    searchName: string;
    pageNo?: number;
    pageSize?: number;
  }) => void;
};

interface IFormData {
  name: string;
}

const CreateCourseTypeDialog = ({
  open,
  onClose,
  handleGetCourseTypes
}: CreateCourseTypeDialogProps) => {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("course_type_name_required"))
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });

  const dispatch = useDispatch();
  const { loggedUser } = useAuth();

  const handleCreate = async (data: IFormData) => {
    if (!loggedUser?.organization?.organizationId) return;
    const createCourseTypeCommand: CreateCourseTypeCommand = {
      name: data.name,
      organizationId: loggedUser.organization.organizationId
    };
    await CourseTypeService.createCourseType(createCourseTypeCommand)
      .then((res) => {
        dispatch(setSuccessMess("Create course type successfully"));
        handleGetCourseTypes({ searchName: "" });
        onClose();
      })
      .catch((error) => {
        dispatch(setErrorMess("Failed to create course type"));
        console.error("Failed to create course type", error);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes["dialog"]}>
      <form onSubmit={handleSubmit(handleCreate)}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Create Course Type
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

export default CreateCourseTypeDialog;
