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

type CreateSectionDialogProps = {
  open: boolean;
  onClose: () => void;
};

interface IFormData {
  sectionName: string;
}

const CreateSectionDialog = ({ open, onClose }: CreateSectionDialogProps) => {
  const { t } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      sectionName: yup.string().required(t("section_required"))
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
  const { courseId } = useParams<{ courseId: string }>();

  const handleCreate = async (data: IFormData) => {
    if (!courseId) return;
    await SectionService.createSection(courseId, data.sectionName)
      .then((res) => {
        dispatch(setSuccessMess("Create section successfully"));
        dispatch(clearSections());
        onClose();
      })
      .catch((error) => {
        dispatch(setErrorMess("Failed to create section"));
        console.error("Failed to create section", error);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} className={classes["dialog"]}>
      <form onSubmit={handleSubmit(handleCreate)}>
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id='customized-dialog-title'
          translation-key='question_bank_edit_category'
        >
          Edit Section
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
            label={t("section_name")}
            type='text'
            inputRef={register("sectionName")}
            errorMessage={errors?.sectionName?.message}
            width='100%'
          />
          {/* <Controller
					name='name'
					control={controlEdit}
					render={({ field }) => (
						<InputTextFieldColumn
							type='text'
							title={t("question_bank_create_category_name")}
							useDefaultTitleStyle
							titleRequired={true}
							{...field}
							fullWidth
							margin='dense'
							error={!!errorsEdit.name}
							errorMessage={errorsEdit.name?.message}
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
				<TitleWithInfoTip
					title={t("question_bank_create_category_info")}
					titleRequired
					fontSize='12px'
					color='var(--gray-60)'
					gutterBottom
					fontWeight='600'
				/>
				<Controller
					name='description'
					control={controlEdit}
					render={({ field }) => (
						<TextEditor
							type='text'
							title={t("question_bank_create_category_info")}
							roundedBorder={true}
							required={true}
							placeholder={t("question_bank_create_category_info")}
							tooltipDescription={t("question_default_score_description")}
							{...field}
							error={!!errorsEdit.description}
							errorMessage={errorsEdit.description?.message}
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/> */}
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

export default CreateSectionDialog;
