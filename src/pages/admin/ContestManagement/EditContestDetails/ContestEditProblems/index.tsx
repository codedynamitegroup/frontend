import {
  Grid,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Heading4 from "components/text/Heading4";
import ParagraphSmall from "components/text/ParagraphSmall";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss";
import Heading6 from "components/text/Heading6";
import ParagraphBody from "components/text/ParagraphBody";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "routes/routes";
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IFormDataType } from "..";
import { ContestQuestionEntity } from "models/coreService/entity/ContestQuestionEntity";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import { useState } from "react";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setSuccessMess } from "reduxes/AppStatus";
import AddContestProblemDialog from "./components/AddContestProblemDialog";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

interface ContestEditProblemsProps {
  control: Control<IFormDataType, any>;
  errors: FieldErrors<IFormDataType>;
  setValue: UseFormSetValue<IFormDataType>;
  watch: UseFormWatch<IFormDataType>;
}

const ContestEditProblems = ({ control, errors, setValue, watch }: ContestEditProblemsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const problems: ContestQuestionEntity[] = watch("problems");

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deletedQuestionId, setDeletedQuestionId] = useState<string>("");

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };
  const onDeleteConfirmDelete = async () => {
    const newProblems = problems.filter((problem) => problem.questionId !== deletedQuestionId);
    setValue("problems", newProblems);
    setIsOpenConfirmDelete(false);
    dispatch(setSuccessMess(t("contest_delete_problem_success")));
  };

  const [isOpenedAddProblemDialog, setIsOpenedAddProblemDialog] = useState(false);

  const handleOpenAddProblemDialog = () => {
    setIsOpenedAddProblemDialog(true);
  };

  const handleCloseAddProblemDialog = () => {
    setIsOpenedAddProblemDialog(false);
  };

  return (
    <>
      <AddContestProblemDialog
        open={isOpenedAddProblemDialog}
        title={t("contest_add_problem_button")}
        handleClose={handleCloseAddProblemDialog}
        maxWidth='md'
        currentQuestionList={problems}
        changeCurrentQuestionList={(newProblems: ContestQuestionEntity[]) =>
          setValue("problems", newProblems)
        }
      />
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_problem_description")}
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <Grid
        container
        gap={2}
        direction='column'
        className={classes.container}
        sx={{
          margin: "0px 20px 20px 20px",
          width: "calc(100% - 40px)",
          minHeight: "600px"
        }}
      >
        <Grid item xs={12}>
          <Heading4 translate-key='contest_problems'>{t("contest_problems")}</Heading4>
          <ParagraphSmall
            fontStyle={"italic"}
            sx={{ marginTop: "10px" }}
            translate-key='contest_problems_description'
          >
            {t("contest_problems_description")}
          </ParagraphSmall>
        </Grid>
        <Dropdown>
          <MenuButton
            color='primary'
            translate-key='contest_add_problem_button'
            variant='outlined'
            sx={{ width: "150px" }}
          >
            {t("contest_add_problem_button")}
          </MenuButton>
          <Menu color='primary'>
            <MenuItem>{t("contest_create_problem_button")}</MenuItem>
            <MenuItem onClick={handleOpenAddProblemDialog}>
              {t("contest_import_problem_button")}
            </MenuItem>
          </Menu>
        </Dropdown>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label='custom table'>
              <TableHead className={classes["table-head"]}>
                <TableRow>
                  <TableCell
                    align='left'
                    sx={{
                      width: "10%"
                    }}
                  >
                    <Heading6 fontWeight={"700"} translation-key='common_no'>
                      {t("common_no")}
                    </Heading6>
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{
                      width: "40%"
                    }}
                  >
                    <Heading6 fontWeight={"700"} translation-key='common_name'>
                      {t("common_name")}
                    </Heading6>
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{
                      width: "20%"
                    }}
                  >
                    <Heading6 fontWeight={"700"} translation-key='common_max_score'>
                      {t("common_max_score")}
                    </Heading6>
                  </TableCell>
                  <TableCell
                    align='left'
                    className={classes.status}
                    sx={{
                      width: "30%"
                    }}
                  >
                    <Heading6 fontWeight={"700"}></Heading6>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {problems &&
                  problems.length > 0 &&
                  problems.map((row, rowIndex) => (
                    <TableRow
                      className={rowIndex % 2 === 0 ? classes.row : classes.row1}
                      key={rowIndex}
                    >
                      <TableCell align='left'>{rowIndex + 1}</TableCell>
                      <TableCell className={classes.tableCell}>
                        <ParagraphSmall fontWeight={"500"} className={classes.linkText}>
                          <Link
                            component={RouterLink}
                            to={routes.user.problem.detail.description.replace(
                              ":problemId",
                              row.codeQuestionId
                            )}
                            underline='hover'
                            color='inherit'
                          >
                            {row.name}
                          </Link>
                        </ParagraphSmall>
                      </TableCell>
                      <TableCell>
                        {row.difficulty === "EASY"
                          ? t("common_easy")
                          : row.difficulty === "MEDIUM"
                            ? t("common_medium")
                            : row.difficulty === "HARD"
                              ? t("common_hard")
                              : 0}
                      </TableCell>
                      <TableCell align='center'>
                        <IconButton
                          translate-key='contest_edit_problem_button'
                          onClick={() => {
                            setDeletedQuestionId(row.questionId);
                            setIsOpenConfirmDelete(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {(!problems || problems.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={{
                        textAlign: "center"
                      }}
                    >
                      <ParagraphBody
                        className={classes.noList}
                        translation-key='list_problem_not_found_data'
                      >
                        {t("list_problem_not_found_data")}
                      </ParagraphBody>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ContestEditProblems;
