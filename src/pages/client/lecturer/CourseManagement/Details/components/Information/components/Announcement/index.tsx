import AccordionActions from "@mui/material/AccordionActions";
import classes from "./styles.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import TextEditor from "components/editor/TextEditor";
import { Box, Button, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputTextField from "components/common/inputs/InputTextField";
import LoadButton from "components/common/buttons/LoadingButton";
import { BtnType } from "components/common/buttons/Button";
import { CreateAnnoucementCommand } from "./../../../../../../../../../models/courseService/entity/create/CreateAnnoucementCommand";
import useAuth from "hooks/useAuth";
import { PostService } from "services/courseService/PostService";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { useParams } from "react-router-dom";
import { clearPosts } from "reduxes/courseService/post";
interface IFormData {
  title: string;
  content: string;
}
const CourseAnnouncement = () => {
  const { t } = useTranslation();
  const [announcementExpansion, setAnnouncementExpansion] = useState(false);
  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required(t("title_required")),
      content: yup.string().required(t("content_required"))
    });
  }, [t]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<IFormData>({
    resolver: yupResolver(schema)
  });
  const { courseId } = useParams<{ courseId: string }>();
  const cancelAnnoucementHandler = () => {
    setAnnouncementExpansion(false);
  };
  const { loggedUser } = useAuth();
  const dispatch = useDispatch();
  const handleSubmitAnnoucement = async (data: IFormData) => {
    if (!loggedUser || !courseId) {
      return;
    }
    const createAnnoucementCommand: CreateAnnoucementCommand = {
      courseId: courseId,
      content: data.content,
      title: data.title,
      isPublished: true,
      createdBy: loggedUser.userId
    };

    setIsLoading(true);
    await PostService.createAnnouncement(createAnnoucementCommand)
      .then((response) => {
        dispatch(setSuccessMess("Announcement created successfully"));
        dispatch(clearPosts());
        reset({
          title: "",
          content: ""
        });
        cancelAnnoucementHandler();
      })
      .catch((error) => {
        dispatch(setErrorMess("Failed to create announcement"));
        console.error("Failed to fetch sections by course id", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box className={classes.container}>
      <form onSubmit={handleSubmit(handleSubmitAnnoucement)}>
        <Accordion expanded={announcementExpansion} className={classes.accordionContainer}>
          <AccordionSummary
            className={classes.accordionSummary}
            onClick={() => {
              setAnnouncementExpansion(true);
            }}
            translation-key='course_lecturer_add_announcement'
          >
            {t("course_lecturer_add_announcement")}
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={cancelAnnoucementHandler} translation-key='common_cancel'>
              {t("common_cancel")}
            </Button>
            <LoadButton
              loading={isLoading}
              btnType={BtnType.Primary}
              colorname='--white'
              autoFocus
              isTypeSubmit
              translation-key='common_post'
            >
              {t("common_post")}
            </LoadButton>
          </AccordionActions>
        </Accordion>
      </form>
    </Box>
  );
};

export default CourseAnnouncement;
