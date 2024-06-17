import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Card, Divider } from "@mui/material";
import Heading1 from "components/text/Heading1";
import ParagraphSmall from "components/text/ParagraphSmall";
import { CodeSubmissionDetailEntity } from "models/codeAssessmentService/entity/CodeSubmissionDetailEntity";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading as setInititalLoading } from "reduxes/Loading";
import { routes } from "routes/routes";
import { CodeSubmissionService } from "services/codeAssessmentService/CodeSubmissionService";
import { ContestService } from "services/coreService/ContestService";
import { AppDispatch } from "store";
import classes from "./styles.module.scss";

const AdminContestSubmissions = () => {
  const breadcumpRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { contestId } = useParams<{ contestId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [contestDetails, setContestDetails] = useState<ContestEntity | null>(null);

  const [codeSubmissions, setCodeSubmissions] = useState<CodeSubmissionDetailEntity[]>();

  const handleGetContestById = useCallback(
    async (id: string) => {
      dispatch(setInititalLoading(true));
      try {
        const getContestDetailsResponse = await ContestService.getContestById(id);
        if (getContestDetailsResponse) {
          setContestDetails(getContestDetailsResponse);
        }
        dispatch(setInititalLoading(false));
      } catch (error: any) {
        console.log("error", error);
        dispatch(setInititalLoading(false));
      }
    },
    [dispatch]
  );

  const handleGetAdminCodeSubmissionsByContestId = useCallback(
    async ({
      codeQuestionId,
      contestId,
      pageNo,
      pageSize
    }: {
      codeQuestionId: string;
      contestId?: string;
      pageNo: number;
      pageSize: number;
    }) => {
      setIsLoading(true);
      try {
        const getAdminCodeSubmissionsByContestIdResponse =
          await CodeSubmissionService.getAdminCodeSubmissionList({
            codeQuestionId,
            contestId,
            pageNo,
            pageSize
          });
        console.log(
          "getAdminCodeSubmissionsByContestIdResponse",
          getAdminCodeSubmissionsByContestIdResponse
        );
        setIsLoading(false);
      } catch (error: any) {
        console.log("error", error);
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (contestId) {
      handleGetContestById(contestId);
    }
  }, [contestId, handleGetContestById]);

  if (!contestId || !contestDetails) {
    return null;
  }
  return (
    <>
      <Card
        sx={{
          "& .MuiDataGrid-root": {
            border: "1px solid #e0e0e0",
            borderRadius: "4px"
          },
          margin: "20px 20px 90px 20px",
          gap: "20px"
        }}
      >
        <Box className={classes.breadcump} ref={breadcumpRef}>
          <Box id={classes.breadcumpWrapper}>
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() => navigate(routes.admin.contest.root)}
              translation-key='contest_management_title'
            >
              {t("contest_management_title")}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall
              colorname='--blue-500'
              className={classes.cursorPointer}
              onClick={() =>
                navigate(routes.admin.contest.edit.details.replace(":contestId", contestId))
              }
            >
              {contestDetails.name}
            </ParagraphSmall>
            <KeyboardDoubleArrowRightIcon id={classes.icArrow} />
            <ParagraphSmall colorname='--blue-500'>{t("detail_problem_submission")}</ParagraphSmall>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            margin: "20px"
          }}
        >
          <Heading1>{t("detail_problem_submission")}</Heading1>
        </Box>
      </Card>
    </>
  );
};

export default AdminContestSubmissions;
