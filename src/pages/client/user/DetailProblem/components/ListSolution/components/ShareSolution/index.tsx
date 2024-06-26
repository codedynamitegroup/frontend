import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import classes from "./styles.module.scss";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "components/Header";
import { routes } from "routes/routes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import MDEditor from "@uiw/react-md-editor";
import ArrowBack from "@mui/icons-material/ArrowBack";
import useBoxDimensions from "hooks/useBoxDimensions";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "hooks";
import * as Yup from "yup";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import cloneDeep from "lodash.clonedeep";
import { SharedSolutionService } from "services/codeAssessmentService/SharedSolutionService";
import { UUID } from "crypto";
import { RootState } from "store";
import { useSelector } from "react-redux";
type FormSolutionValue = {
  solution: string;
  title: string;
};

export default function ShareSolution() {
  const schema = Yup.object().shape({
    solution: Yup.string()
      .required(`Solution is required`)
      .test(
        "not-blank",
        `Solution is required`,
        (value) => value !== undefined && value.trim().length > 0
      ),
    title: Yup.string()
      .required(`title is required`)
      .test(
        "not-blank",
        `title is required`,
        (value) => value !== undefined && value.trim().length > 0
      )
  });
  const {
    register,
    handleSubmit,
    watch,
    control: solutionControl,
    formState: { errors }
  } = useForm<FormSolutionValue>({
    resolver: yupResolver(schema)
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const sourceCode = state ? state.sourceCode : undefined;
  const title = state ? state.title : undefined;
  const content = state ? state.content : undefined;
  const initTag: { id: UUID; name: string }[] | undefined = state ? state.tags : undefined;
  const solutionId: string | undefined = state ? state.solutionId : undefined;
  const edit: boolean | undefined = state ? state.edit : undefined;
  const sidebarStatus = useSelector((state: RootState) => state.sidebarStatus);
  const tag = useAppSelector((state) => state.algorithmnTag);
  const sortedTag = cloneDeep(tag.tagList).sort((a, b) =>
    a.name < b.name ? 1 : a.name === b.name ? 0 : -1
  );
  const mapIdToTagName = new Map<string, string>();
  sortedTag.forEach((value) => mapIdToTagName.set(value.id, value.name));
  const [selectedTag, setSelectedTag] = React.useState<string[]>([]);
  const [postLoading, setPostLoading] = React.useState(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const onChangeSelectTag = (event: SelectChangeEvent<typeof selectedTag>) => {
    const {
      target: { value }
    } = event;
    if (typeof value !== "string") setSelectedTag(value);
  };

  useEffect(() => {
    if (initTag) setSelectedTag(initTag.map((i) => i.id));
  }, [initTag]);

  const { problemId, courseId, lessonId } = useParams<{
    problemId: string;
    courseId: string;
    lessonId: string;
  }>();
  const findAddAndRemove = (): { addedTagId: string[]; removedTagIds: string[] } => {
    if (initTag === undefined || initTag.length === 0)
      return { addedTagId: selectedTag, removedTagIds: [] };
    else {
      const initTagSet = new Set<string>();
      initTag.forEach((item) => initTagSet.add(item.id));
      const selectedTagSet = new Set<string>();
      selectedTag.forEach((item) => selectedTagSet.add(item));
      let addedTagId: string[] = [];
      let removedTagIds: string[] = [];

      initTag.forEach((item) => {
        if (!selectedTagSet.has(item.id)) removedTagIds.push(item.id);
      });
      selectedTag.forEach((item) => {
        if (!initTagSet.has(item)) addedTagId.push(item);
      });
      return { addedTagId, removedTagIds };
    }
  };
  const onSolutionSubmit = (data: FormSolutionValue) => {
    if (problemId !== undefined) {
      setPostLoading(true);
      if (edit) {
        if (solutionId) {
          const { addedTagId, removedTagIds } = findAddAndRemove();
          SharedSolutionService.editSharedSolution(
            solutionId,
            data.solution,
            data.title,
            removedTagIds,
            addedTagId
          )
            .then((data) => {
              console.log("solution ", data);
              navigate(-1);
            })
            .catch((err) => {
              console.log(err);
              setPostLoading(false);
            });
        } else setPostLoading(false);
      } else {
        SharedSolutionService.createSharedSolution(
          problemId,
          data.title,
          data.solution,
          selectedTag
        )
          .then((data) => {
            console.log("solution ", data);
            navigate(-1);
          })
          .catch((err) => {
            console.log(err);
            setPostLoading(false);
          });
      }
    }
  };
  const templateSolution =
    content ??
    `**Your solution**
  ${
    sourceCode
      ? `\`\`\`
${sourceCode}
\`\`\``
      : ""
  }
  `;

  const handleBackButton = () => {
    navigate(-1); //go back
  };
  return (
    <Grid className={classes.root}>
      <Header />
      <Container
        className={classes.container}
        style={{
          marginTop: `${sidebarStatus.headerHeight}px`,
          height: `calc(100% - ${sidebarStatus.headerHeight}px)`
        }}
      >
        <Box className={classes.stickyBack} onClick={handleBackButton}>
          <Box className={classes.backButton}>
            <ArrowBack className={classes.backIcon} />
            <span translation-key='common_back'>{t("common_back")}</span>
          </Box>
        </Box>
        <Divider />
        <Select
          labelId='demo-multiple-chip-label'
          id='demo-multiple-chip'
          multiple
          value={selectedTag}
          onChange={onChangeSelectTag}
          input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={mapIdToTagName.get(value) ?? ""} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {sortedTag.map((value) => (
            <MenuItem
              key={value.id}
              value={value.id}

              // style={getStyles(name, personName, theme)}
            >
              {value.name}
            </MenuItem>
          ))}
        </Select>
        <form onSubmit={handleSubmit(onSolutionSubmit)}>
          <Box className={classes.content}>
            <TextField
              {...register("title")}
              defaultValue={title ?? ""}
              id='outlined-multiline-static'
              multiline
              rows={2}
              variant='standard'
              InputProps={{
                disableUnderline: true,
                style: { fontSize: "20px" } // Thêm dòng này
              }}
              placeholder={t("common_title")}
              translation-key='common_title'
              fullWidth
              InputLabelProps={{
                shrink: false
              }}
              className={classes.titleInput}
            ></TextField>
            <Box className={classes.actionBtn}>
              <Button
                variant='contained'
                className={classes.postBtn}
                translation-key='common_post common_edit'
                type='submit'
                disabled={postLoading}
              >
                {postLoading ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : (
                  t(edit ? "common_edit" : "common_post")
                )}
              </Button>
            </Box>
            <Box data-color-mode='light'>
              <Controller
                control={solutionControl}
                name='solution'
                defaultValue={templateSolution}
                render={({ field: { ...field } }) => (
                  <MDEditor {...field} className={classes.markdownEditor} />
                )}
              ></Controller>
            </Box>
          </Box>
        </form>
      </Container>
    </Grid>
  );
}
