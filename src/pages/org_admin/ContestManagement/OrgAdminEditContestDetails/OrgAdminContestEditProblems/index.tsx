import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import {
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import ConfirmDelete from "components/common/dialogs/ConfirmDelete";
import ConfirmUpdate from "components/common/dialogs/ConfirmUpdate";
import Heading4 from "components/text/Heading4";
import Heading6 from "components/text/Heading6";
import ParagraphBody from "components/text/ParagraphBody";
import ParagraphSmall from "components/text/ParagraphSmall";
import { ContestQuestionEntity } from "models/coreService/entity/ContestQuestionEntity";
import { IFormDataType } from "pages/admin/ContestManagement/EditContestDetails";
import { useCallback, useState } from "react";
import { Control, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setErrorMess, setSuccessMess } from "reduxes/AppStatus";
import { AppDispatch } from "store";
import AddContestProblemDialog from "./components/OrgAdminAddContestProblemDialog";
import classes from "./styles.module.scss";

interface ContestEditProblemsProps {
  control: Control<IFormDataType, any>;
  errors: FieldErrors<IFormDataType>;
  setValue: UseFormSetValue<IFormDataType>;
  watch: UseFormWatch<IFormDataType>;
}

const OrgAdminContestEditProblems = ({
  control,
  errors,
  setValue,
  watch
}: ContestEditProblemsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const problems: ContestQuestionEntity[] = watch("problems");

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isOpenConfirmUpdateProblems, setIsOpenConfirmUpdateProblems] = useState(false);
  const [deletedQuestionId, setDeletedQuestionId] = useState<string>("");
  const [newProblems, setNewProblems] = useState<ContestQuestionEntity[] | null>(null);

  const onCancelConfirmDelete = () => {
    setIsOpenConfirmDelete(false);
  };

  const onCancelConfirmUpdateProblems = () => {
    setIsOpenConfirmUpdateProblems(false);
  };

  const onDeleteConfirmDelete = async () => {
    const newProblems = problems.filter((problem) => problem.questionId !== deletedQuestionId);
    setValue("problems", newProblems);
    setIsOpenConfirmDelete(false);
    dispatch(setSuccessMess(t("contest_delete_problem_success")));
  };

  const handleOpenConfirmUpdateProblems = useCallback((newProblems: ContestQuestionEntity[]) => {
    setIsOpenConfirmUpdateProblems(true);
    setNewProblems(newProblems);
  }, []);

  const handleUpdateProblems = useCallback(() => {
    setIsOpenConfirmUpdateProblems(false);
    if (!newProblems) {
      dispatch(setErrorMess(t("contest_update_problems_error")));
      return;
    }
    setValue("problems", newProblems);
    dispatch(setSuccessMess(t("contest_update_problems_success")));
    setNewProblems(null);
    setIsOpenedAddProblemDialog(false);
  }, [dispatch, newProblems, setValue, t]);

  const [isOpenedAddProblemDialog, setIsOpenedAddProblemDialog] = useState(false);

  const handleOpenAddProblemDialog = () => {
    setIsOpenedAddProblemDialog(true);
  };

  const handleCloseAddProblemDialog = () => {
    setIsOpenedAddProblemDialog(false);
  };

  return (
    <>
      {isOpenedAddProblemDialog && (
        <AddContestProblemDialog
          open={isOpenedAddProblemDialog}
          title={t("contest_add_problem_button")}
          handleClose={handleCloseAddProblemDialog}
          maxWidth='md'
          currentQuestionList={problems}
          onHanldeConfirm={handleOpenConfirmUpdateProblems}
        />
      )}
      <ConfirmDelete
        isOpen={isOpenConfirmDelete}
        title={t("dialog_confirm_delete_title")}
        description={t("dialog_confirm_delete_problem_description")}
        onCancel={onCancelConfirmDelete}
        onDelete={onDeleteConfirmDelete}
      />
      <ConfirmUpdate
        isOpen={isOpenConfirmUpdateProblems}
        title={t("dialog_confirm_update_problems_title")}
        description={t("dialog_confirm_update_problems_description")}
        onCancel={onCancelConfirmUpdateProblems}
        onUpdate={handleUpdateProblems}
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
                      width: "15%"
                    }}
                  >
                    <Heading6 fontWeight={"700"} translation-key='common_max_score'>
                      {t("common_max_score")}
                    </Heading6>
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{
                      width: "15%"
                    }}
                  >
                    <Heading6 fontWeight={"700"} translation-key='common_max_score'>
                      {t("common_difficulty_level")}
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
                        <ParagraphSmall fontWeight={"500"}>{row.name}</ParagraphSmall>
                      </TableCell>
                      <TableCell>{row.maxGrade}</TableCell>
                      <TableCell>
                        <Heading6
                          fontWeight={600}
                          colorname={
                            row.difficulty === "EASY"
                              ? "--green-500"
                              : row.difficulty === "MEDIUM"
                                ? "--orange-5"
                                : "--red-hard"
                          }
                        >
                          {row.difficulty === "EASY"
                            ? t("common_easy")
                            : row.difficulty === "MEDIUM"
                              ? t("common_medium")
                              : row.difficulty === "HARD"
                                ? t("common_hard")
                                : 0}
                        </Heading6>
                      </TableCell>
                      <TableCell align='center'>
                        <Stack direction='row' spacing={1}>
                          <IconButton
                            translate-key='contest_edit_problem_button'
                            onClick={() => {
                              if (!row?.organization?.id) {
                                return;
                              }
                              // navigate to edit problem page
                            }}
                            sx={{
                              "&:hover": {
                                cursor: `${row?.organization?.id ? "pointer" : "not-allowed"}`
                              }
                            }}
                          >
                            {row?.organization?.id ? (
                              <EditIcon />
                            ) : (
                              <Tooltip
                                title={
                                  "This question is owned by CodeDynamite and cannot be modified "
                                }
                              >
                                <LockIcon />
                              </Tooltip>
                            )}
                          </IconButton>
                          <IconButton
                            translate-key='contest_edit_problem_button'
                            onClick={() => {
                              setDeletedQuestionId(row.questionId);
                              setIsOpenConfirmDelete(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
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

export default OrgAdminContestEditProblems;
